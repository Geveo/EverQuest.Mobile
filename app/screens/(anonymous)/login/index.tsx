import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import AppTheme from "../../../helpers/theme";
import SCButtonWithoutArrow from "../../../components/button-without-arrow/button-without-arrow";
import AnonymousLayout from "../../../components/layouts/anonymous-layout";
import "text-encoding";
import { Wallet } from "xrpl";
const xrpl = require("xrpl");
import AccountService from "../../../services/services-domain/account-service";
import Toast from "react-native-root-toast";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from "../../../services/toast-service";
import { ToastMessageTypes } from "../../../helpers/constants";

const screenWidth = Dimensions.get("window").width;

const saveCredentials = async (XRP_Address, secret) => {
  try {
    await AsyncStorage.setItem('XRP_Address', XRP_Address);
    await AsyncStorage.setItem('secret', secret);
  } catch (error) {
    console.error('Error saving credentials:', error);
  }
};

export default function Login({ title, navigation }) {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const UrlConstants = {
    XRPL_URL: "wss://xahau-test.net/",
  };
  const xrplClient = new xrpl.Client(UrlConstants.XRPL_URL);
  if (!AccountService.instance) {
    AccountService.instance = new AccountService();
  }
  const _accountService = AccountService.instance;
  const [seed, setSeed] = useState('');
  const [error, setError] = useState('');
  const toast = useRef(null);
  const showError = () => {
    //toast.current && toast.current.show(error, { duration: Toast.durations.LONG });
  }
  useEffect(() => {
    async function connect() {
      await xrplClient.connect();
    }
    connect();
  }, [xrplClient]);

  const handleLoginRequest = async () => {
    if (seed !== '') {
      try {
        await xrplClient.connect();

        const wallet = Wallet.fromSeed(seed, { algorithm: xrpl.ECDSA });
        if (wallet) {
          console.log("wallet", wallet);

          const msgObj = {
            public_Key: wallet.publicKey,
            XRP_Address: wallet.address
          };
          console.log("Message Obj: ", msgObj)
          var hasAccount = await _accountService.hasAccount(msgObj);

          console.log("hasAccount", hasAccount);
          navigation.navigate("HomeScreen")
          if (hasAccount) {
            showToast("Login Succesful", ToastMessageTypes.success);
            saveCredentials(wallet.address, seed);
            navigation.navigate("HomeScreen")
          } else {
            showToast("Invalid Login!", ToastMessageTypes.error);
            setError("Invalid Login.");
            console.log("Error", error);
            showError()
          }
        }
        else {
          console.log("Error", wallet);
          setError("Wallet does not exists");
          showError();
        }
      } catch (error) {
        console.log("Error", error);
        setError("Invalid Login.");
        showError();
      }
    } else {
      setError("Please provide a key.");
    }
  };

  return (
    <AnonymousLayout showWaitIndicator={showLoadingIndicator}>
      <View style={styles.mainContainer}>
        <Toast ref={toast} />
        <View>
          <Text style={styles.title}>Login</Text>
        </View>
        <View>
          <Text style={styles.subText}>Login with your crypto wallet</Text>
        </View>

        <View style={styles.container}>
          <TextInput style={styles.input}
            //secureTextEntry={true}
            underlineColorAndroid="transparent"
            placeholder="Enter XRPL secret key"
            placeholderTextColor={AppTheme.colors.mediumGrey}
            autoCapitalize="none"
            onChangeText={setSeed} />
        </View>

        <View style={styles.button}>
          <SCButtonWithoutArrow
            onTap={handleLoginRequest}
            text="Login"
            bgColor={AppTheme.colors.buttonGreen}
            textColor={AppTheme.colors.white}
          />
        </View>
        <Toast ref={toast} />
      </View>
    </AnonymousLayout>
  );
}

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: "center",
    height: screen.height,
    width: screen.width,
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
    marginTop: screen.height * 0.04,
    alignSelf: "center",
  },
  subText: {
    fontSize: 18,
    marginTop: screen.height * 0.02,
    alignSelf: "center",
  },
  button: {
    marginTop: screen.height * 0.1,
    width: screenWidth * 0.85,
  },
  container: {
    paddingTop: 23,
    width: screenWidth * 0.85,
  },
  input: {
    margin: 15,
    borderColor: AppTheme.colors.lineGreen,
    borderWidth: 2,
    backgroundColor: "#F6FEF9",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontWeight: "500",
  },
});

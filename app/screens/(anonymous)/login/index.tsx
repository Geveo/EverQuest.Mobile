import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import SCButton from "../../../components/button/button";
import AppTheme from "../../../helpers/theme";
import SCButtonWithoutArrow from "../../../components/button-without-arrow/button-without-arrow";
import AnonymousLayout from "../../../components/layouts/anonymous-layout";
import "text-encoding";
import { Wallet } from "xrpl";
const xrpl = require("xrpl");
import AccountService from "../../../services/services-domain/account-service";
import Toast from "react-native-root-toast";

const screenWidth = Dimensions.get("window").width;

export default function Login({ title, navigation }) {
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const handleBackPress = () => {
    navigation.goBack();
  };

  const UrlConstants = {
    XRPL_URL: "wss://xahau-test.net/",
    CONTRACT_URLS: ["wss://dapps-dev.geveo.com:26313"]
  };
  const xrplClient = new xrpl.Client(UrlConstants.XRPL_URL);
  if (!AccountService.instance) {
    AccountService.instance = new AccountService();
  }
  const _accountService = AccountService.instance;
  const [seed, setSeed] = useState('');
  const [error, setError] = useState('');
  const toast = useRef(null);
  const showError = (error_message) => {
    //toast.current && toast.current.show(error_message, { duration: Toast.durations.LONG });
    setError('Error');
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

        const wallet = Wallet.fromSeed(seed);
        if (wallet) {
          console.log("wallet", wallet);
          const credentialsObject = {
            privateKey: wallet.privateKey,
            publicKey: wallet.publicKey,
            address: wallet.address,
            seed: seed
          };
          const msgObj = {
            public_Key: wallet.publicKey,
            XRP_Address: wallet.address
          };
          var hasAccount = await _accountService.hasAccount(msgObj);

          console.log("hasAccount", hasAccount);
          if (hasAccount) {
            navigation.navigate("HomeScreen")
          } else {
            setError("Invalid Login.");
            console.log("Error", error);
            showError(error)
          }
        }
        else {
          console.log("Error", wallet);
          setError("Invalid Login.");
          showError("Invalid Login.");
        }
      } catch (error) {
        console.log("Error", error);
        setError("Invalid Login.");
        showError("Invalid Login.");
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

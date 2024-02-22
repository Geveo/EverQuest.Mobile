import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LandingScreen from "./screens/(anonymous)/landing";
import Home from "./screens/(authorized)/home";
import Account from "./screens/(authorized)/account";
import SplashScreen from "./screens/(anonymous)/splash";
import SportsCatergory from "./screens/(authorized)/sports-catergory";
import WalletScreen from "./screens/(authorized)/wallet";
import GamesList from "./screens/(authorized)/games-list";
import Tournament from "./screens/(authorized)/tournament";
import Challenge from "./screens/(authorized)/challenge";
import RoundDetails from "./screens/(authorized)/round-details";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={"SplashScreen"}
      >
        <Stack.Screen
          name="HomeScreen"
          component={Home}
          options={{ title: "Home" }}
        />

        <Stack.Screen
          name="LandingScreen"
          component={LandingScreen}
          options={{ title: "Landing" }}
        />

        <Stack.Screen
          name="WalletScreen"
          component={WalletScreen}
          options={{ title: "Wallet Screen" }}
        />

        <Stack.Screen
          name="AccountScreen"
          component={Account}
          options={{ title: "Account" }}
        />

        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ title: "Splash" }}
        />

        <Stack.Screen
          name="SportsCatergory"
          component={SportsCatergory}
          options={{ title: "Sports Catergory" }}
        />

        <Stack.Screen
          name="GamesList"
          component={GamesList}
          options={{ title: "Games List" }}
        />

        <Stack.Screen
          name="Tournament"
          component={Tournament}
          options={{ title: "Tournament" }}
        />

        <Stack.Screen
          name="Challenge"
          component={Challenge}
          options={{ title: "Challenge" }}
        />

        <Stack.Screen
          name="RoundDetails"
          component={RoundDetails}
          options={{ title: "RoundDetails" }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

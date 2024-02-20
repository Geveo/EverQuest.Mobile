// import { Configuration } from "@azure/msal-browser"
import { MSALConfiguration } from 'react-native-msal';

export const MSALConfig : MSALConfiguration = {
  auth: {
      clientId : "42d95333-1920-4be8-a244-afa38c7d4463",
      redirectUri : "msauth://com.geveo.stepchamp.mobile/DicuknrYif%2F%2BM%2FTXFNWLUXs%2BkIE%3D",
      knownAuthorities : [
      ]
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  },
}

export const GoogleConfig = {
  clientId:  "652195495981-sk46duu29ej7o28takl9lujov86uvfq9.apps.googleusercontent.com",
};

import React, { useState } from "react";
import { useEffect } from "react";

import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { Provider } from "react-redux";
import { store } from "./redux/store";

import Main from "./components/Main";
import Loader from "./components/Loader";


SplashScreen.preventAutoHideAsync();
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    prepareFonts();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const prepareFonts = async () => {
    try {
      await Font.loadAsync({
        "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
        "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
      });
      setAppIsReady(true);
    } catch (e) {
      console.log("fonts did not load", e.message);
      setAppIsReady(false);
    }
  };

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <Main />
      <Loader/>
    </Provider>
  );
}

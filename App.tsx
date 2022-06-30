import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import AnimatedAppLoader from "./components/AnimatedAppLoader";
import MainScreen from "./components/MainScreen";

SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

const App = () => {
  return (
    <AnimatedAppLoader/>
  );
}

export default App;
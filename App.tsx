import * as SplashScreen from "expo-splash-screen";
import React from "react";
import AnimatedAppLoader from "./components/AnimatedAppLoader";


SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

const App = () => {
  return (
    <AnimatedAppLoader/>
  );
}

export default App;
import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";
import { useCallback, useState } from "react";

import AnimatedSplashScreen from "./AnimatedSplashScreen";

const AnimatedAppLoader = () => {
    const [isSplashReady, setSplashReady] = useState(false);
    const startAsync = useCallback(
      // If you use a local image with require(...), use `Asset.fromModule`
      () => new Promise<void>((resolve, reject) => Asset.fromModule(require(`../assets/splash.png`)).downloadAsync()),
      []
    );

    const onFinish = useCallback(() => setSplashReady(true), []);

    return <AnimatedSplashScreen/>;
  }

  export default AnimatedAppLoader;
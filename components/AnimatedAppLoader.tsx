import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";
import { useCallback, useState } from "react";

import AnimatedSplashScreen from "./AnimatedSplashScreen";


const AnimatedAppLoader = ({ children, image}: ComponentProps) => {
    const [isSplashReady, setSplashReady] = useState(false);

    const startAsync = useCallback(
      // If you use a local image with require(...), use `Asset.fromModule`
      () => new Promise<void>((resolve, reject) => Asset.fromURI(image).downloadAsync()),
      [image]
    );

    const onFinish = useCallback(() => setSplashReady(true), []);

    if (!isSplashReady) {
      return (
        <AppLoading
          // Instruct SplashScreen not to hide yet, we want to do this manually
          autoHideSplash={false}
          startAsync={startAsync}
          onError={console.error}
          onFinish={onFinish}
        />
      );
    }

    return <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>;
  }

  export default AnimatedAppLoader;
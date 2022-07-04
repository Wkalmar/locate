import Constants from "expo-constants";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Animated, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as MediaLibrary from 'expo-media-library';
import MainScreen from './MainScreen';

const AnimatedSplashScreen = () => {
    const animation = useMemo(() => new Animated.Value(1), []);
    const [isAppReady, setAppReady] = useState(false);
    const [isSplashAnimationComplete, setAnimationComplete] = useState(false);
    const [markers, setMarkers] = useState<MediaLibrary.Location[]>([])

    useEffect(() => {
      if (isAppReady) {
        Animated.timing(animation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setAnimationComplete(true));
      }
    }, [isAppReady]);



    const onImageLoaded = useCallback(async () => {
      let markersArray : MediaLibrary.Location[] = [];
      try {
        let { status } = await MediaLibrary.requestPermissionsAsync();

        let hasMoreData = true;
        let request : MediaLibrary.AssetsOptions = {
          mediaType: ['photo', 'video'],
        }
        let markersSet : Set<MediaLibrary.Location> = new Set();
        while (hasMoreData) {
          let cursor = await MediaLibrary.getAssetsAsync(request);
          const markersArray = await Promise.all(cursor.assets.map(async element => {
            let image = await MediaLibrary.getAssetInfoAsync(element);
            return image.location;
          }));
          let nonNullLocations = markersArray.filter(p => p != undefined) as MediaLibrary.Location[];
          nonNullLocations.forEach(markersSet.add, markersSet);
          hasMoreData = cursor.hasNextPage;
          request.after = cursor.endCursor
        }
        markersArray = [...markersSet]
        setMarkers(markersArray);
        await SplashScreen.hideAsync();
      } catch (e) {
        console.log(e)
        // handle errors
      } finally {
        setAppReady(true);
      }
    }, []);

    return (
      <View style={{ flex: 1 }}>
        {isAppReady && (<MainScreen markers={markers}/>)}
        {!isSplashAnimationComplete && (<Animated.View
          pointerEvents="none"
          style={[
            //StyleSheet.absoluteFill,
            {
              backgroundColor: Constants.manifest?.splash?.backgroundColor,
              opacity: animation,
            },
          ]}>
          <Animated.Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: Constants.manifest?.splash?.resizeMode || "contain",
              transform: [
                {
                  scale: animation,
                },
              ],
            }}
            source={require("../assets/splash.png")}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>)}
      </View>
    );
  }

  export default AnimatedSplashScreen;
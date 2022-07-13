import Constants from "expo-constants";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Animated, Easing, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as MediaLibrary from 'expo-media-library';
import MainScreen from './MainScreen';

const AnimatedSplashScreen = () => {
    const textAnimation = useMemo(() => new Animated.Value(0), []);
    const [isAppReady, setAppReady] = useState(false);
    const [isTextAnimationIsReady, setTextAnimationIsReady] = useState(false);
    const [markers, setMarkers] = useState<MediaLibrary.Location[]>([])

    useEffect(() => {
      if (!isAppReady && isTextAnimationIsReady) {
        Animated.timing(textAnimation, {
          toValue: 1,
          duration: 200,
          easing: Easing.inOut(Easing.exp),
          useNativeDriver: true,
        }).start();
      }
    }, [isAppReady, isTextAnimationIsReady]);

    let medialibraryRequest : MediaLibrary.AssetsOptions = {
      mediaType: ['photo', 'video'],
    }

    const populateLocationsIntoSet = async (
      cursor : MediaLibrary.PagedInfo<MediaLibrary.Asset>,
      markersSet : Set<MediaLibrary.Location>) => {
        const markersArray = await Promise.all(cursor.assets.map(async element => {
          let image = await MediaLibrary.getAssetInfoAsync(element);
          return image.location;
        }));
        let nonNullLocations = markersArray.filter(p => p != undefined) as MediaLibrary.Location[];
        nonNullLocations.forEach(markersSet.add, markersSet);
    }

    const onImageLoaded = useCallback(async () => {
      let markersArray : MediaLibrary.Location[] = [];
      let hasMoreData = true;
      try {
        var timeStart = Date.now();
        let { status } = await MediaLibrary.requestPermissionsAsync();
        await SplashScreen.hideAsync();

        let markersSet : Set<MediaLibrary.Location> = new Set();
        while (hasMoreData) {
          let cursor = await MediaLibrary.getAssetsAsync(medialibraryRequest);
          await populateLocationsIntoSet(cursor, markersSet);

          hasMoreData = cursor.hasNextPage;
          medialibraryRequest.after = cursor.endCursor

          let now = Date.now();
          let delta = now - timeStart;
          if (delta > 2000 && !isTextAnimationIsReady) {
            setTextAnimationIsReady(true);
          }
        }
        markersArray = [...markersSet]
        setMarkers(markersArray);
      } catch (e) {
        console.log(e)
      } finally {
        setAppReady(!hasMoreData);
      }
    }, []);

    return (
      <View style={{ flex: 1 }}>
        {isAppReady && (<MainScreen markers={markers}/>)}
        {!isAppReady && (<Animated.View
          pointerEvents="none"
          style={[
            //StyleSheet.absoluteFill,
            {
              backgroundColor: Constants.manifest?.splash?.backgroundColor
            },
          ]}>
          <Animated.Text style={{
            opacity: textAnimation,
            color: '#E81E25',
            fontWeight: "700",
            fontStyle: "italic",
            position: "absolute",
            bottom: 20,
            alignSelf:"center"
          }}>
            Hold on! We're doing some magic just for you...
          </Animated.Text>
          <Animated.Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: Constants.manifest?.splash?.resizeMode || "contain",
              transform: [
                {
                  scale: 1,
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
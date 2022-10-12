import Constants from "expo-constants";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Animated, Easing, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as MediaLibrary from 'expo-media-library';
import MainScreen from './MainScreen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmptyMarkersScreen from './EmptyMarkersScreen';

const cachedMarkersKey : string = "markers";
const cachedLastItemIdKey : string = "lastItemId";

const AnimatedSplashScreen = () => {
    const textAnimation = useMemo(() => new Animated.Value(0), []);
    const [isAppReady, setAppReady] = useState(false);
    const [isMarkersSetEmpty, setMarkersSetEmpty] = useState(true);
    const [isTextAnimationIsReady, setTextAnimationIsReady] = useState(false);
    const [loadingText, setLoadingText] = useState("");
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
          if (image.location != null) {
            await AsyncStorage.setItem(element.id, JSON.stringify(image.location))
          }
          return image.location;
        }));
        if (markersArray.length === 0) {
          return;
        }
        let nonNullLocations = markersArray.filter(p => p != undefined) as MediaLibrary.Location[];
        nonNullLocations.forEach(markersSet.add, markersSet);
    }

    const loadLocations = async () => {
      let markersArray : MediaLibrary.Location[] = [];
      let hasMoreData = true;
      try {
        let { status } = await MediaLibrary.requestPermissionsAsync();
        await SplashScreen.hideAsync();
        let timeStart = Date.now();
        let markersSet : Set<MediaLibrary.Location> = new Set();

        await tryGetLocationsFromCache(markersSet);
        while (hasMoreData) {
          let cursor = await MediaLibrary.getAssetsAsync(medialibraryRequest);
          await populateLocationsIntoSet(cursor, markersSet);
          hasMoreData = cursor.hasNextPage;
          medialibraryRequest.after = cursor.endCursor
          lastId = cursor.endCursor;
          let now = Date.now();
          let delta = now - timeStart;
          if (delta > 9000) {
            setLoadingText(`We've processed ${markersSet.size} items. There's more work though...`)
          } else if (delta > 5000) {
            setLoadingText("Working on it...")
          } else if (delta > 2000) {
            if (!isTextAnimationIsReady) {
              setTextAnimationIsReady(true);
            }
            setLoadingText("Hold on! We're doing some magic just for you...")
          }
        }
        markersArray = [...markersSet]
        setMarkers(markersArray);
        setMarkersSetEmpty(markersArray.length === 0);
        await setLocationsToCache(lastId);
      } catch (e) {
        console.log(e)
      } finally {
        setAppReady(!hasMoreData);
      }

      async function setLocationsToCache(lastId: string) {
        await AsyncStorage.setItem(cachedLastItemIdKey, lastId);
        await AsyncStorage.setItem(cachedMarkersKey, JSON.stringify(markersArray));
      }

      async function tryGetLocationsFromCache(markersSet: Set<MediaLibrary.Location>) {
        const cachedMarkers = await AsyncStorage.getItem(cachedMarkersKey);
        const lastItemIdCache = await AsyncStorage.getItem(cachedLastItemIdKey);
        if (cachedMarkers != null && lastItemIdCache != null && lastItemIdCache !== "") {
          let parsedMarkers = JSON.parse(cachedMarkers) as MediaLibrary.Location[];
          if (parsedMarkers != null && parsedMarkers.length !== 0) {
            parsedMarkers.forEach(markersSet.add, markersSet);
            medialibraryRequest.after = lastItemIdCache;
          }
        }
      }
    }

    const onImageLoaded = useCallback(async () => {
      await loadLocations();
    }, []);

    return (
      <View style={{ flex: 1 }}>
        {isAppReady && isMarkersSetEmpty && (<EmptyMarkersScreen/>)}
        {isAppReady && !isMarkersSetEmpty && (<MainScreen markers={markers}/>)}
        {!isAppReady && (<Animated.View
          pointerEvents="none"
          style={[
            {
              backgroundColor: Constants.manifest?.splash?.backgroundColor
            },
          ]}>
          <Animated.Text style={{
            opacity: textAnimation,
            color: '#E81E25',
            fontWeight: "700",
            position: "absolute",
            bottom: 20,
            alignSelf:"center"
          }}>
            {loadingText}
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
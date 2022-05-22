import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import MapView, { Marker } from 'react-native-maps';
import * as MediaLibrary from 'expo-media-library';
import {captureRef} from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { DefaultTheme, FAB } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';

const App = () => {
  const [markers, setMarkers] = useState<MediaLibrary.Location[]>([])

  let map = useRef<MapView>(null);

  useEffect(() => {
    async function prepare() {
      let markersArray : MediaLibrary.Location[] = [];
      try {
        await SplashScreen.preventAutoHideAsync();

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
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
        map.current?.fitToCoordinates(markersArray, {
          edgePadding: DEFAULT_PADDING,
          animated: true,
        });
      }
    }
    prepare();
  }, []);

  const captureAndShareScreenshot = async () => {
    const uri = await captureRef(map, {
        format: "png",
        quality: 1
    })
    await Sharing.shareAsync("file://" + uri);
  };

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
  }, [])

  return (
    <View style={styles.container}>
      <MapView ref={map}
        style={styles.map}>
        {markers.map((item) => (
          <Marker
            key={Math.random()}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            icon={require('./assets/marker.png')}>
          </Marker>
        ))}
      </MapView>
      <FAB
          icon="share"
          accessibilityLabel='share'
          style={styles.fab}
          onPress={captureAndShareScreenshot}
          visible={true}
          theme={CustomTheme}
          color='#E81E25'
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  fab: {
    flex: 1,
    flexDirection:'row',
    position:'absolute',
    bottom:10,
    right:20,
    alignSelf: "center",
    justifyContent: "space-between"
  },
});

const DEFAULT_PADDING = {top:100, bottom:100, left:100, right:100};

const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    accent: '#FFD874'
  }
};

export default App;
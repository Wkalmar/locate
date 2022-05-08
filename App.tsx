import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import MapView, { Marker } from 'react-native-maps';
import * as MediaLibrary from 'expo-media-library';

const App = () => {
  const [markers, setMarkers] = useState<MediaLibrary.Location[]>([])

  let map = useRef<MapView>(null);

  const fetchMedia = useCallback(() => {
    const fetch = async () => {
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
      const markersArray = [...markersSet]
      map.current?.fitToCoordinates(markersArray, {
        edgePadding: DEFAULT_PADDING,
        animated: true,
      })
      setMarkers(markersArray);
    }
    fetch().catch(console.error);
  }, []);

  useEffect( () => {
    fetchMedia();
  }, [])

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

const DEFAULT_PADDING = {top:50, bottom:50, left:50, right:50};

export default App;
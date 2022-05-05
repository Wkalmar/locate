import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import MapView, { Marker } from 'react-native-maps';
import * as MediaLibrary from 'expo-media-library';

const App = () => {
  const [markers, setMarkers] = useState<MediaLibrary.Location[]>([])

  const fetchMedia = useCallback(async () => {
    let markersArray : MediaLibrary.Location[] = []
      let { status } = await MediaLibrary.requestPermissionsAsync();
      let cursor = await MediaLibrary.getAssetsAsync({
        mediaType: ['photo', 'video'],
      });
      let image = await MediaLibrary.getAssetInfoAsync(cursor.assets[0]);
      if (image.location) {
       markersArray.push(image.location);
      }
      setMarkers(markersArray);
  }, []);

  useEffect( () => {
    fetchMedia();
  }, [])

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
  }, [])

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {markers.map((item) => (
          <Marker key={Math.random()}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}></Marker>
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

export default App;
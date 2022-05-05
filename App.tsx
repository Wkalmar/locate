import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import MapView from 'react-native-maps';
import * as MediaLibrary from 'expo-media-library';

class App extends React.Component {
  fetchMedia = async () => {
    let { status } = await MediaLibrary.requestPermissionsAsync();
    let cursor = await MediaLibrary.getAssetsAsync({
      mediaType: ['photo', 'video'],
    });
    let image = await MediaLibrary.getAssetInfoAsync(cursor.assets[0]);
    return image.location;
  };

  componentDidMount = async () => {
    await this.fetchMedia();
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
  }

  render = () => {
    return (
      <View style={styles.container}>
        <MapView style={styles.map} />
      </View>
    );
  };
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
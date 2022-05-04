import React, { Component } from 'react';
import { StyleSheet, Dimensions , View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import MapView from 'react-native-maps';

class App extends React.Component {
  componentDidMount = async () => {
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
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {captureRef} from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { FAB } from 'react-native-paper';
import CustomTheme from '../CustomTheme';
import * as MediaLibrary from 'expo-media-library';
import MainScreenProps from './MainScreenProps';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const MainScreen = ({markers}: MainScreenProps) => {
    let map = useRef<MapView>(null);

    const [isAdReady, setAdReady] = useState(false);

    const fitAllMarkers = () => {
      const boundingBox = markers
      if (markers.length === 1) {
        markers.push({latitude: markers[0].latitude+0.1, longitude: markers[0].longitude+0.1})
      }
      map.current?.fitToCoordinates(boundingBox, {
        edgePadding: DEFAULT_PADDING,
        animated: true,
    })};

    const captureAndShareScreenshot = async () => {
      const uri = await captureRef(map, {
          format: "png",
          quality: 1
      })
      await Sharing.shareAsync("file://" + uri);
    };

    useEffect(() => {
      setTimeout(()=>{
        setAdReady(true);
      }, 5000);
    },[])

    return (
       <View style={styles.container}>
          {isAdReady &&
            <BannerAd
              unitId=""
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}/>}
        <MapView ref={map}
          style={styles.map}
          onMapLoaded={fitAllMarkers}>
          {markers.map((item : MediaLibrary.Location) => (
            <Marker
              key={Math.random()}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              icon={require('../assets/marker.png')}>
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
            label='Share'
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
    }
  });

  const DEFAULT_PADDING = {top:111, bottom:111, left:111, right:111};

  export default MainScreen;
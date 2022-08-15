import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import MapView, { Marker } from 'react-native-maps';
import {captureRef} from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { FAB } from 'react-native-paper';
import { AdMobBanner } from 'expo-ads-admob';
import CustomTheme from '../CustomTheme';

const MainScreen = ({markers}: MainScreenProps) => {
    let map = useRef<MapView>(null);

    const [isAdReady, setAdReady] = useState(false);

    const fitAllMarkers = () => {
      map.current?.fitToCoordinates(markers, {
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
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    }, [])

    useEffect(() => {
      setTimeout(()=>{
        setAdReady(true);
      }, 5000);
    },[])

    return (
      <View style={styles.container}>
        {isAdReady && <AdMobBanner
          bannerSize="smartBannerLandscape"
          adUnitID="ca-app-pub-3940256099942544/6300978111"
          servePersonalizedAds/>}
        <MapView ref={map}
          style={styles.map}
          onMapLoaded={fitAllMarkers}>
          {markers.map((item) => (
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

  const DEFAULT_PADDING = {top:100, bottom:100, left:100, right:100};

  export default MainScreen;
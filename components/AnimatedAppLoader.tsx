import NetInfo from '@react-native-community/netinfo';
import AnimatedSplashScreen from "./AnimatedSplashScreen";
import { useEffect,useState } from 'react';
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import OfflineScreen from './OfflineScreen';


const AnimatedAppLoader = () => {
  const [isConnected, setConnected] = useState(false)
  const [isConnectionProbeFinished, setConnectionProbeFinished] = useState(false)

  useEffect(() => {
    const fetchConnection = async () => {
      const connectionStaus = await NetInfo.fetch();
      setConnected(connectionStaus.isConnected === true)
      if (!connectionStaus.isConnected) {
        await SplashScreen.hideAsync();
      }
      setConnectionProbeFinished(true)
    }

    fetchConnection()
  }, [])

  return (
      <View style={{ flex: 1 }}>
      {isConnected && isConnectionProbeFinished && <AnimatedSplashScreen/>}
      {!isConnected && isConnectionProbeFinished && <OfflineScreen/>}
      </View>
    )
  }

  export default AnimatedAppLoader;
import { View, StyleSheet, BackHandler } from "react-native";
import { Button, Text } from 'react-native-paper';
import CustomTheme from "../CustomTheme";

const EmptyMarkersScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
            Locate! could not find any photos that contain geotag. {'\n'}
            You should either enable geolocation in your camera settings or start taking photos.
            </Text>
            <Button
                icon="close"
                mode="contained"
                buttonColor="#E81E25"
                textColor="#FFF"
                theme={CustomTheme}
                style={styles.button}
                onPress={() => close()}>
                    Got it
            </Button>
        </View>
    )
}

const close = () => {
    BackHandler.exitApp()
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFD874"
    },
    button:{
        position: "absolute",
        bottom: 20,
        alignSelf:"center"
    },
    text:{
        position: "absolute",
        top:"45%",
        color: '#E81E25',
        fontWeight: "700",
        alignSelf:"center",
        textAlign:"center"
    }})

export default EmptyMarkersScreen;

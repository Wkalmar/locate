import { View, StyleSheet } from "react-native";
import { Button, Text } from 'react-native-paper';
import CustomTheme from "../CustomTheme";

const OfflineScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Locate! needs an internet connection to function properly. {'\n'}
                Refresh this page once you enable it.
            </Text>
            <Button
                icon="refresh"
                mode="contained"
                buttonColor="#E81E25"
                textColor="#FFF"
                theme={CustomTheme}
                style={styles.button}>
                    Refresh
            </Button>
        </View>
    )
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

export default OfflineScreen;
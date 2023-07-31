import { Camera, CameraType, onCameraReady, CameraPictureOptions } from 'expo-camera';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CameraSendToServer() {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [camera, setCamera] = useState(null);

    // const getPermission = async () => {
    //     //requestPermission(await Camera.requestCameraPermissionsAsync());
    //     //requestPermission(status === await Camera.requestCameraPermissionsAsync())
    //     const status = await Camera.requestCameraPermissionsAsync();
    //     requestPermission(status);
    //     // (async () => {
    //     //     requestPermission(await Camera.requestCameraPermissionsAsync());
    //     // })();
    // }

    useEffect(() => {
        (async () => {
            const answer = await Camera.requestCameraPermissionsAsync();
            //requestPermission(await Camera.requestCameraPermissionsAsync());
            requestPermission(answer === 'granted');
        })();
    }, [])

    function toggleCameraType(){
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
        console.log("Camera: ", type)
    }

    async function takePhoto(){
        if(camera){
            const options = {quality: 0.5, base64: true, onPictureSaved: (data) => sendToServer(data)}
            const data = await camera.takePictureAsync(options)
        }
    }

    async function sendToServer(data){
        console.log("HERE", data.uri)

        let id = await AsyncStorage.getItem('@user_id');
        let token = await AsyncStorage.getItem("@session_token");

        let res = await fetch(data.uri);
        let blob = await res.blob()

        //network request here

        return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
            method: "post",
            headers: {
                "Content-Type": "image/png",
                "X-Authorization": token
            },
            body: blob
        })
        .then((response) => {
            console.log("Picture addedd", response);
        })
        .catch((err) => {
            console.log(err);
        })
    }



    if(!permission || !permission.granted){
        return (<Text>No access to camera</Text>)
    }else{
        return (
            <View style={styles.container}>
                <Camera style={styles.camera} type={type} ref={ref => setCamera(ref)}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                            <Text style={styles.text}>Flip Camera</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={takePhoto}>
                            <Text style={styles.text}>Take Photo</Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
            </View>
        );
    }  
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonContainer: {
        alignSelf: 'flex-end',
        padding: 5,
        margin: 5,
        backgroundColor: 'steelblue'
    },
    button: {
        width: '100%',
        height: '100%'
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ddd'
    }
})
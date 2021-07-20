import * as React from 'react';
import {Button, View, Platform, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class PickImage extends React.Component{
    state = {
        image:null,
    }

    getCameraPermissions = async () =>{

        if(Platform.OS !== "web"){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if(status !== "granted"){
                Alert.alert("Sorry Camera Roll Permissions Needs to be Enabled.")
            }
        }
    }

    componentDidMount(){
        this.getCameraPermissions
    }

    pickImage = async () => {
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                MediaTypes: ImagePicker.MediaTypeOptions.All,
                allowEditing:true,
                aspect:[4, 3],
                quality:1,
            })
            if(!result.cancelled){
                this.setState({image:result.data})
                console.log(result.uri)
                this.uploadImage(result.uri)
            }
        }
        catch(error){
            console.log(error)
        }

    }

    uploadImage = async (uri) => {
        const data = FormData()
        let fileName = uri.split("/")[uri.split("/").length-1]
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        const filetoupload = {
            uri:uri,
            name:fileName,
            type:type,
        }
        data.append("digit", filetoupload)
        fetch("http://367e90f195a8.ngrok.io/predict-digit",
            {
                method:"POST",
                body:data,
                headers:{"content-type":"multipart/form-data"}
            },

        ).then((response)=> response.json())
        .then((result)=>{
            console.log("Success", result)
        }).catch((error)=>{console.log(error)})
    }

    render(){

        let {image} = this.state

        return(
            <View style = {{alignItem : 'center', justifyContent : 'center', flex : 1}}>
                <Button 
                    title = "Pick Image from Camera Roll"
                    onPress = {this.pickImage}
                    
                ></Button>
            </View>
        );
    }
}
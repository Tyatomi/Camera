import React from 'react';
import { Button, Text, View, TouchableOpacity, sclo, CameraRoll, Image, StatusBar,Platform, StyleSheet } from 'react-native';
import { Camera, Permissions, FileSystem, ImagePicker, GLView, Constants } from 'expo';


const styles = StyleSheet.create({
  view: {
    //paddingTop: Constants.statusBarHeight, 
    flex: 1,
  },
  statusBar: {
    //paddingTop: Constants.statusBarHeight, 
  },
  camera: {
    paddingTop: Constants.statusBarHeight, 
    flex: 1,
  },
  image : {
    width:80,
    height:300,
    marginLeft: 250,
    marginTop: 240,    
  }
});

export default class CameraExample extends React.Component {
  state = {
    hasCameraPermission: null,
    hasCameraRollPermission: null,
    type: Camera.Constants.Type.back,
    
  };

  async componentWillMount() {
    this.setCameraStatus();
    this.setCameraRollStatus();
  }

  //カメラのpermissionのstatus取得
  async setCameraStatus(){
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  //カメラロールのpermissionのstatus取得
  async setCameraRollStatus(){
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasCameraRollPermission: status === 'granted' });
  }

  //画像保存メソッド
  snap = async () => {
    if (this.camera) {
      //画像をキャッシュメモリに一時的に保存
      let photo = await this.camera.takePictureAsync();

      //ファイル名
      const filename = new Date().getTime() + '.jpg';
      //ファイルの保存先
      const imageUri = Expo.FileSystem.documentDirectory + filename;
     
      //画像をファイルにコピーし保存
      await Expo.FileSystem.copyAsync({from: photo.uri, to: imageUri});
      //カメラロールに保存
      await CameraRoll.saveToCameraRoll(imageUri, 'photo');
    }
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={styles.view}>
        <StatusBar hidden={true} />
          <Camera style={styles.camera} type={this.state.type} ref={ref => { this.camera = ref; }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}{' '}
                </Text>
              </TouchableOpacity>
              <Image source={require('./img/sample01.png')} style={styles.image}/>
            </View>
          </Camera>
          <Button onPress={this.snap}title="press" />
        </View>
      );
    }
  }

}
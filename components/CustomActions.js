import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import "firebase/firestore";
import firebase from "firebase";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { LinearGradient } from "expo-linear-gradient";

class CustomActions extends React.Component {
  // uploads image to firestore storage
  uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split("/");
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    const ref = firebase.storage().ref().child(`images/${imageName}`);

    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  // user can pick image from phone gallery
  pickImage = async () => {
    console.log("pick image");
    // No permissions request is necessary for launching the image library
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
      }).catch((error) => console.log(error));

      if (!result.cancelled) {
        const imageUrl = await this.uploadImage(result.uri);
        this.props.onSend({ image: imageUrl });
      }
      // }
    } catch (error) {
      console.error(error);
    }
  };

  // user can take image with camera
  takePicture = async () => {
    console.log("take picture");
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.MEDIA_LIBRARY
    );

    try {
      if (status === "granted") {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).catch((error) => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // user can get geolocationSam
  getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    try {
      if (status === "granted") {
        let result = await Location.getCurrentPositionAsync({}).catch((error) =>
          console.log(error)
        );

        if (result) {
          console.log(result);
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            },
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  //displays extra actions when user clicks the plus button
  onActionPress = () => {
    const options = [
      "Choose From Library",
      "Take Picture",
      "Send Location",
      "Cancel",
    ];
    const cancelButtonIndex = options.length - 1;
    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            return this.pickImage();
          case 1:
            return this.takePicture();
          case 2:
            return this.getLocation();
        }
      }
    );
  };

  render() {
    return (
      <LinearGradient
        colors={["#00d4ff", "#5d0979"]}
        style={[styles.container, styles.gradient]}
      >
        <TouchableOpacity
          style={[styles.container]}
          onPress={this.onActionPress}
        >
          <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 28,
    height: 28,
    marginBottom: 10,
  },
  gradient: {
    borderRadius: 14,
    marginLeft: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: "#b2b2b2",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

export default connectActionSheet(CustomActions);

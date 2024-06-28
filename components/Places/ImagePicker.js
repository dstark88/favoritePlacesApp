import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { useState, useEffect } from "react";

import { Colors } from '../../constants/colors';
import OutlinedButton from '../UI/OutlinedButton';

function ImagePicker() {
  const [pickedImage, setPickedImage] = useState();
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  // This useEffect hook logs the current state of pickedImage whenever it changes.
  useEffect(() => {
    console.log("Updated picked image URI:", pickedImage);
  }, [pickedImage]);

  // Function to verify camera permissions.
  async function verifyPermissions() {
    console.log(
      "Current camera permission status:",
      cameraPermissionInformation.status
    );

    // Request permission if the status is undetermined.
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    // Show alert if permission was previously denied.
    if (
      cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions:",
        "You need to grant camera permissions to use this feature"
      );
      return false;
    }

    // Return true if permissions are already granted.
    return true;
  }

  // Function to handle the action of taking an image using the camera.
  async function takeImageHandler() {
    try {
      const hasPermission = await verifyPermissions();
      if (!hasPermission) return;

      const imageResult = await launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.5,
      });

      // Accessing the first item in the assets array from the imageResult.
      const imageContent = imageResult.assets[0];

      console.log("Image picker result:", imageResult.assets[0].uri);

      // Setting the image URI if the operation wasn't cancelled and a URI exists.
      if (!imageContent.canceled && imageContent.uri) {
        setPickedImage(imageContent.uri);
      } else {
        console.log("Image picking was cancelled or no URI found");
      }
    } catch (error) {
      console.log("Error during image picking:", error);
      Alert.alert("Error", "Could not take an image.");
    }
  }

  // Preparing the image preview element.
  let imagePreview = <Text>No image taken yet</Text>;
  if (pickedImage) {
    // Display the image if a URI is available.
    imagePreview = (
      <Image
        source={{ uri: pickedImage }}
        style={{ width: "100%", height: 200 }}
      />
    );
  }

  return (
    <View>
      <View>{imagePreview}</View>
      <OutlinedButton icon="camera" onPress={takeImageHandler}>Take Image</OutlinedButton>
    </View>
  );
}

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

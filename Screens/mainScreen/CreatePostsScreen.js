import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
} from "react-native";
import HideWithKeyboard from "react-native-hide-with-keyboard";

import { useSelector } from "react-redux";
import {
  selectUserEmail,
  selectUserId,
  selectUserName,
  selectUserPhoto,
} from "../../redux/auth/authSelectors";

import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

import { ref, getDownloadURL, uploadBytes, getStorage } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

export default function CreatePostsScreen({
  navigation,
  navigation: { goBack },
}) {
  //photo from image library
  const [photo, setPhoto] = useState(null);
  //location user
  const [location, setLocation] = useState({
    latitude: 34.052235,
    longitude: -118.243683,
  });
  //input add comment
  const [comment, setComment] = useState("");
  //add location input
  const [locationText, setLocationText] = useState("");

  const userId = useSelector(selectUserId);
  const userName = useSelector(selectUserName);
  const userEmail = useSelector(selectUserEmail);
  const userPhoto = useSelector(selectUserPhoto);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  const sendPostToServer = async () => {
    await uploadPostToServer();
    navigation.navigate("DefaultPostsScreen");
    deletePost();
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(photo);
    const file = await response.blob();
    const filename = new Date().getTime() + "userPost.jpg";

    const storage = getStorage();
    const storageRef = ref(storage, "postImage/" + filename);

    await uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });

    return await getDownloadURL(storageRef).then((downloadURL) => {
      return downloadURL;
    });
  };

  async function uploadPostToServer() {
    //I'm waiting for the photo to be uploaded to the server and I get the URL for it
    const url = await uploadPhotoToServer();

    // send data to the FireStore server
    try {
      await addDoc(collection(db, "userPost"), {
        userId,
        userName,
        userEmail,
        userPhoto,
        comment,
        locationText,
        url: url,
        location: location,
        commentsLength: 0,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  //open the gallery on the phone and insert the desired photo on the user's screen
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const deletePost = () => {
    setPhoto(null);
    setLocationText("");
    setComment("");
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <AntDesign
            name="arrowleft"
            size={24}
            color="black"
            onPress={() => goBack()}
            style={styles.header.btn}
          />
          <Text style={styles.header.title}>Create Post</Text>
        </View>

        <View style={styles.imageContainer}>
          {photo ? (
            <>
              <ImageBackground
                source={{ uri: photo }}
                style={{
                  height: 240,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                imageStyle={{ borderRadius: 8 }}
              >
                <TouchableOpacity
                  style={{
                    ...styles.imageContainer.imageBtn,
                    backgroundColor: "rgba(255,255,255, 0.2)",
                  }}
                >
                  <MaterialIcons name="photo-camera" size={24} color="#fff" />
                </TouchableOpacity>
              </ImageBackground>
            </>
          ) : (
            <TouchableOpacity
              style={styles.imageContainer.imageBtn}
              onPress={() => pickImage()}
            >
              <MaterialIcons name="photo-camera" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.uploadPhotoBtn}
          onPress={() => pickImage()}
        >
          {photo ? (
            <Text style={styles.uploadPhotoBtn.uploadPhotoBtnTitle}>
              Edit photo
            </Text>
          ) : (
            <Text style={styles.uploadPhotoBtn.uploadPhotoBtnTitle}>
              Upload photo
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ ...styles.commentAndLocationInput, marginBottom: 20 }}>
          <FontAwesome5
            name="comment-dots"
            size={20}
            color="#BDBDBD"
            style={{ ...styles.commentAndLocationInput.marker, bottom: 9 }}
          />
          <TextInput
            placeholder="Comment..."
            placeholderTextColor="#BDBDBD"
            name="comment"
            value={comment}
            onChangeText={(value) => setComment(value)}
          />
        </View>

        <View style={{ ...styles.commentAndLocationInput, marginBottom: 30 }}>
          <Image
            style={styles.commentAndLocationInput.marker}
            source={require("../../assets/images/marker.png")}
          />
          <TextInput
            placeholder="Location..."
            placeholderTextColor="#BDBDBD"
            name="location"
            value={locationText}
            onChangeText={(value) => setLocationText(value)}
          />
        </View>

        {photo && comment && locationText ? (
          <TouchableOpacity
            style={styles.publishPostBtn}
            activeOpacity={0.7}
            onPress={sendPostToServer}
          >
            <Text style={styles.publishPostBtn.title}>Publish</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ ...styles.publishPostBtn, backgroundColor: "#F6F6F6" }}
            activeOpacity={0.7}
            onPress={sendPostToServer}
            disabled={true}
          >
            <Text style={{ ...styles.publishPostBtn.title, color: "#BDBDBD" }}>
              Publish
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <HideWithKeyboard>
        <TouchableOpacity
          style={{
            ...styles.deletePostBtn,
          }}
          activeOpacity={0.7}
          onPress={deletePost}
        >
          <AntDesign name="delete" size={22} color="#BDBDBD" />
        </TouchableOpacity>
      </HideWithKeyboard>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    marginTop: 50,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#BDBDBD",
    justifyContent: "center",
    btn: {
      height: 24,
      position: "absolute",
      left: 15,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      marginBottom: 15,
      fontFamily: "Roboto",
      fontStyle: "normal",
      fontWeight: "600",
      fontSize: 17,
      lineHeight: 22,
      color: "#212121",
    },
  },

  imageContainer: {
    height: 240,
    marginHorizontal: 15,
    backgroundColor: "#F6F6F6",

    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    marginBottom: 8,

    imageBtn: {
      width: 60,
      height: 60,
      backgroundColor: "#fff",
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
    },
  },

  uploadPhotoBtn: {
    marginHorizontal: 15,
    marginBottom: 30,
    uploadPhotoBtnTitle: {
      fontFamily: "Roboto",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: 16,
      lineHeight: 19,
      color: "#BDBDBD",
    },
  },

  commentAndLocationInput: {
    marginHorizontal: 15,

    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",

    paddingTop: 15,
    paddingBottom: 10,
    paddingRight: 15,
    paddingLeft: 25,

    borderWidth: 1,
    borderColor: "transparent",
    borderBottomColor: "#E8E8E8",
    justifyContent: "center",

    marker: {
      height: 24,
      height: 24,
      marginRight: 15,

      position: "absolute",
      left: 0,
      bottom: 12,
      justifyContent: "center",
      alignItems: "center",
    },
  },

  publishPostBtn: {
    justifyContent: "center",
    alignItems: "center",

    paddingBottom: 16,
    paddingTop: 16,
    borderRadius: 100,
    backgroundColor: "#FF6C00",
    marginHorizontal: 15,

    title: {
      fontFamily: "Roboto-Regular",
      fontStyle: "normal",
      fontWeight: "400",
      color: "#FFFFFF",
      fontSize: 16,
      lineHeight: 19,
    },
  },

  deletePostBtn: {
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    width: 70,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: 25,
  },
});

// import { Camera } from "expo-camera";
//======
//   //силка на камеру рефи різні і може методи
// const [camera, setCamera] = useState(null);
// //фото з камери
// const [photo, setPhoto] = useState(null);
//відкрити закрити камеру
// const [openCamera, setOpenCamera] = useState(false);
//дозвіл викор камеру
// const [permission, setRequestPermission] = Camera.useCameraPermissions();

//   // Camera.requestCameraPermissionsAsync();
// // console.log(permission);
// const takePhoto = async () => {
//   if (!permission.granted) {
//     Camera.requestCameraPermissionsAsync();
//   }
//   //отримуем фото
//   const photoUri = await camera.takePictureAsync();
//   setPhoto(photoUri.uri);
//   // const photo = await Camera.requestCameraPermissionsAsync();
// };
//======

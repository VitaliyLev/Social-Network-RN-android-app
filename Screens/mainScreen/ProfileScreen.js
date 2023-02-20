import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { ScrollView } from "react-native-virtualized-view";

import { useDispatch, useSelector } from "react-redux";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
//choose library user photo
import * as ImagePicker from "expo-image-picker";

import {
  selectUserId,
  selectUserName,
  selectUserPhoto,
} from "../../redux/auth/authSelectors";
import { setUserPhoto } from "../../redux/auth/authReducer";
import { uploadUserPhotoToServer } from "../../utils/refreshUserPhoto";
import {
  updateUserPhoto,
  deleteUserPhotoFromAuth,
  authSignOutUser,
} from "../../redux/auth/authOperations";

import { Feather } from "@expo/vector-icons";

export default function ProfileScreen({ route, navigation }) {
  const userId = useSelector(selectUserId);
  const userName = useSelector(selectUserName);
  const userPhotoUri = useSelector(selectUserPhoto);
  const [userPosts, setUserPosts] = useState([]);
  const [currentUserPhoto, setCurrentUserPhoto] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    getUserPost();
    setCurrentUserPhoto(userPhotoUri);
  }, []);

  //get all the posts of the current user
  const getUserPost = async () => {
    const queryUserPost = query(
      collection(db, "userPost"),
      where("userId", "==", userId)
    );

    await onSnapshot(queryUserPost, (docUserPosts) => {
      const posts = [];
      docUserPosts.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
      });
      setUserPosts(posts);
    });
  };

  //pick image from phone library
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      //update photo user in storage firebase
      const urlUserPhoto = await uploadUserPhotoToServer(result.assets[0].uri);

      await setCurrentUserPhoto(urlUserPhoto);
      //update user photo in Firebase Auth
      await updateUserPhoto(urlUserPhoto);
      //update photo in redux
      await dispatch(setUserPhoto(urlUserPhoto));
    }
  };

  //delete user photo
  const deletUserPhoto = async () => {
    //delete photo url in firebase auth (user data)
    await deleteUserPhotoFromAuth();
    //delete photo his user from redux
    await dispatch(setUserPhoto(null));
    //delete the photo on the page
    setCurrentUserPhoto(null);
  };

  //window height
  const { width, height } = Dimensions.get("window");

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        source={require("../../assets/images/bgimage.jpg")}
      >
        <ScrollView>
          <View
            style={{
              ...styles.flatContainer,
              minHeight: height - 155,
            }}
          >
            <Feather
              name="log-out"
              size={24}
              color="#BDBDBD"
              onPress={() => dispatch(authSignOutUser())}
              style={styles.btnLogOut}
            />

            <View style={styles.userPhoto}>
              {currentUserPhoto ? (
                <ImageBackground
                  source={{ uri: currentUserPhoto }}
                  style={{
                    width: 120,
                    height: 120,
                  }}
                  imageStyle={{ borderRadius: 20 }}
                >
                  <TouchableOpacity onPress={() => deletUserPhoto()}>
                    <Image
                      style={{ ...styles.addUserPhoto, width: 30, height: 30 }}
                      source={require("../../assets/images/deleteuserphoto.png")}
                    />
                  </TouchableOpacity>
                </ImageBackground>
              ) : (
                <TouchableOpacity onPress={() => pickImage()}>
                  <Image
                    style={styles.addUserPhoto}
                    source={require("../../assets/images/adduserphoto.png")}
                  />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.title}>{userName}</Text>

            {userPosts.length === 0 ? (
              <View style={styles.containerIfNoPost}>
                <Text style={styles.containerIfNoPost.title}>
                  Hello, {userName}!
                </Text>
                <Text style={styles.containerIfNoPost.subTitle}>
                  Add your first post,{" "}
                  <Text
                    style={styles.containerIfNoPost.btn}
                    onPress={() => navigation.navigate("CreatePostsScreen")}
                  >
                    Click here.
                  </Text>
                </Text>
              </View>
            ) : (
              <FlatList
                data={userPosts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.postContainer}>
                    <View style={styles.postImageContaiter}>
                      <Image
                        source={{ uri: item.url }}
                        style={styles.postImageContaiter.postImage}
                      />
                      <Text style={styles.postImageContaiter.comment}>
                        {item.comment}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
                        style={styles.containerCommentsAndLocation}
                        activeOpacity={0.7}
                        onPress={() =>
                          navigation.navigate("CommentsScreen", {
                            comment: item.comment,
                            url: item.url,
                            postId: item.id,
                          })
                        }
                      >
                        <Image
                          style={styles.containerCommentsAndLocation.shape}
                          source={
                            Number(item.commentsLength) !== 0
                              ? require("../../assets/images/shapes.png")
                              : require("../../assets/images/shape.png")
                          }
                        />
                        {Number(item.commentsLength) !== 0 ? (
                          <Text
                            style={
                              styles.containerCommentsAndLocation.commentLength
                            }
                          >
                            {item.commentsLength}
                          </Text>
                        ) : (
                          <Text
                            style={
                              styles.containerCommentsAndLocation.commentNull
                            }
                          >
                            0
                          </Text>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.containerCommentsAndLocation}
                        activeOpacity={0.7}
                        onPress={() =>
                          navigation.navigate("MapScreen", {
                            location: item.location,
                            markerText: item.locationText,
                          })
                        }
                      >
                        <Image
                          style={styles.containerCommentsAndLocation.marker}
                          source={require("../../assets/images/marker.png")}
                        />
                        <Text
                          style={styles.containerCommentsAndLocation.location}
                        >
                          {item.locationText}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  flatContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: 120,
  },
  btnLogOut: {
    marginRight: 15,
    marginTop: 20,
    marginLeft: "auto",
  },
  userPhoto: {
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    alignSelf: "center",
    marginTop: -104,
  },
  addUserPhoto: {
    width: 25,
    height: 25,
    top: 80,
    left: 105,
  },
  title: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "500",
    letterSpacing: 0.16,
    lineHeight: 35,
    color: "#212121",
    fontSize: 30,
    marginTop: 30,
    marginBottom: 30,
    alignSelf: "center",
  },

  containerIfNoPost: {
    marginHorizontal: 15,

    title: {
      fontFamily: "Roboto",
      fontStyle: "normal",
      fontWeight: "500",
      letterSpacing: 0.16,
      lineHeight: 35,
      fontSize: 22,
      color: "#212121",
    },

    subTitle: {
      fontFamily: "Roboto",
      fontStyle: "normal",
      fontWeight: "400",
      letterSpacing: 0.16,
      lineHeight: 35,
      fontSize: 15,
      color: "#212121",

      marginRight: 10,
    },

    btn: {
      fontSize: 18,
      textDecorationLine: "underline",
    },
  },

  postContainer: {
    marginBottom: 30,
    marginHorizontal: 15,
  },
  postImageContaiter: {
    maxWidth: 400,
    postImage: {
      height: 270,
      width: "100%",
      borderRadius: 15,
    },
    comment: {
      fontFamily: "Roboto",
      fontStyle: "normal",
      fontWeight: "500",
      color: "#212121",
      fontSize: 16,
      lineHeight: 19,

      marginTop: 8,
      marginBottom: 8,
    },
  },
  containerCommentsAndLocation: {
    flexDirection: "row",
    alignItems: "center",

    shape: {
      marginRight: 8,
      with: 16,
      height: 18,
    },
    marker: {
      marginRight: 8,
      with: 16,
      height: 18,
    },
    commentNull: {
      fontFamily: "Roboto",
      fontStyle: "normal",
      fontWeight: "400",
      color: "#BDBDBD",
      fontSize: 16,
      lineHeight: 19,
    },
    commentLength: {
      fontFamily: "Roboto",
      fontStyle: "normal",
      fontWeight: "400",
      color: "#BDBDBD",
      fontSize: 16,
      lineHeight: 19,
      color: "#212121",
    },
    location: {
      fontFamily: "Roboto",
      fontStyle: "normal",
      fontWeight: "400",
      color: "#212121",
      fontSize: 16,
      lineHeight: 19,

      borderBottomColor: "rgba(33, 33, 33, 0.2)",
      borderBottomWidth: 1,
    },
  },
});

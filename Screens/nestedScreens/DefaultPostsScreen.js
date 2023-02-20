import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../../firebase/config";
import Loader from "../../components/Loader";

export default function DefaultPostsScreen({ navigation }) {
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    getAllPost();
  }, []);

  const getAllPost = async () => {
    //get the entire PostsUser collection
    await onSnapshot(collection(db, "userPost"), (allUserPosts) => {
      const posts = [];
      allUserPosts.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
      });
      setUserPosts(posts);
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={userPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.userContainer}>
              <Image
                source={{ uri: item.userPhoto }}
                style={styles.userPhoto}
              />
              <View style={styles.userCredential}>
                <Text style={styles.userCredential.userName}>
                  {item.userName}
                </Text>
                <Text style={styles.userCredential.userEmail}>
                  {item.userEmail}
                </Text>
              </View>
            </View>

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
              style={{ flexDirection: "row", justifyContent: "space-between" }}
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
                    style={styles.containerCommentsAndLocation.commentLength}
                  >
                    {item.commentsLength}
                  </Text>
                ) : (
                  <Text style={styles.containerCommentsAndLocation.commentNull}>
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
                <Text style={styles.containerCommentsAndLocation.location}>
                  {item.locationText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Loader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  postContainer: {
    marginBottom: 20,
    marginLeft: 15,
    marginRight: 15,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 15,
  },
  userPhoto: {
    width: 60,
    height: 60,
    backgroundColor: "silver",
    borderRadius: 16,
    marginRight: 8,
  },
  userCredential: {
    userName: {
      fontFamily: "Roboto",
      fontStyle: "normal",
      fontWeight: "700",
      color: "#212121",
      fontSize: 13,
      lineHeight: 15,
    },
    userEmail: {
      fontFamily: "Roboto",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: 11,
      lineHeight: 13,
      color: "rgba(33, 33, 33, 0.8)",
    },
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

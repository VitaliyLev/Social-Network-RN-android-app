import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { useSelector } from "react-redux";
import {
  selectUserName,
  selectUserPhoto,
} from "../../redux/auth/authSelectors";

import { db } from "../../firebase/config";
import { collection } from "firebase/firestore";
import { addDoc, onSnapshot } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

import { AntDesign } from "@expo/vector-icons";
import { dateTimeNow } from "../../utils/getTimeFunc";

export default function CommentsScreen({ route }) {
  const { url } = route.params;
  const { postId } = route.params;

  const [addComment, setAddComment] = useState("");
  const [allComment, setAllComment] = useState([]);

  const userName = useSelector(selectUserName);
  const userPhotoUrl = useSelector(selectUserPhoto);

  useEffect(() => {
    getAllComments();
  }, []);

  const createComment = async () => {
    //time comment
    const dateTimeComment = dateTimeNow();

    //create a new collection of comments on a specific photo
    const collectionRef = await collection(db, "userPost", postId, "comments");
    await addDoc(collectionRef, {
      userName,
      comment: addComment,
      time: dateTimeComment,
      userPhotoUrl,
    });
    //count the comments on a specific photo and record them in the post array
    await updateLengthComments();

    setAddComment("");
  };

  const getAllComments = async () => {
    //get a link to the collection of comments
    const comentsCollectionRef = await collection(
      db,
      "userPost",
      postId,
      "comments"
    );

    //get the entire collection of comments
    await onSnapshot(comentsCollectionRef, (allUserComments) => {
      const userComments = [];
      allUserComments.forEach((doc) => {
        userComments.push({ ...doc.data(), id: doc.id });
      });
      setAllComment(userComments);
    });
  };

  const updateLengthComments = async () => {
    const lengthComment = allComment.length + 1;
    const docRef = await doc(db, "userPost", postId);

    await setDoc(docRef, { commentsLength: lengthComment }, { merge: true })
      .then((docRef) => {
        console.log("Entire Document has been updated successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.postImageContaiter}>
          <Image
            source={{ uri: url }}
            style={styles.postImageContaiter.postImage}
          />
        </View>

        <SafeAreaView style={styles.FlatListContainer}>
          <FlatList
            data={allComment}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <>
                {index % 2 === 0 ? (
                  <View style={styles.usersCommentContainerLeft}>
                    <View style={styles.usersCommentContainerLeft.userPhoto}>
                      <Image
                        source={{ uri: item.userPhotoUrl }}
                        style={styles.usersCommentContainerLeft.userPhoto}
                      />
                    </View>

                    <View
                      style={styles.usersCommentContainerLeft.commentContainer}
                    >
                      <Text
                        style={
                          styles.usersCommentContainerLeft.commentContainer
                            .comment
                        }
                      >
                        {item.comment}
                      </Text>
                      <Text
                        style={
                          styles.usersCommentContainerLeft.commentContainer.time
                        }
                      >
                        {item.time}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.usersCommentContainerRight}>
                    <View
                      style={styles.usersCommentContainerRight.commentContainer}
                    >
                      <Text
                        style={
                          styles.usersCommentContainerRight.commentContainer
                            .comment
                        }
                      >
                        {item.comment}
                      </Text>
                      <Text
                        style={
                          styles.usersCommentContainerRight.commentContainer
                            .time
                        }
                      >
                        {item.time}
                      </Text>
                    </View>

                    <View style={styles.usersCommentContainerRight.userPhoto}>
                      <Image
                        source={{ uri: item.userPhotoUrl }}
                        style={styles.usersCommentContainerLeft.userPhoto}
                      />
                    </View>
                  </View>
                )}
              </>
            )}
          />
        </SafeAreaView>

        <View
          style={{
            justifyContent: "flex-end",
            marginHorizontal: 15,
            marginBottom: 15,
          }}
        >
          <TextInput
            style={styles.commentInput}
            placeholder="Comment..."
            placeholderTextColor="#BDBDBD"
            name="comment"
            value={addComment}
            onChangeText={(value) => setAddComment(value)}
          />
          {addComment ? (
            <TouchableOpacity
              style={styles.commentInput.button}
              activeOpacity={0.7}
              onPress={createComment}
            >
              <AntDesign name="arrowup" size={24} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.commentInput.button}
              activeOpacity={0.7}
              onPress={createComment}
              disabled={true}
            >
              <AntDesign name="arrowup" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  postImageContaiter: {
    maxWidth: 400,
    marginTop: 30,
    marginBottom: 30,

    marginLeft: 15,
    marginRight: 15,

    postImage: {
      height: 270,
      width: "100%",
      borderRadius: 15,
    },
  },

  FlatListContainer: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
  },

  usersCommentContainerLeft: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 20,

    userPhoto: {
      width: 40,
      height: 40,
      backgroundColor: "silver",
      borderRadius: 16,
      marginRight: 15,
    },
    commentContainer: {
      paddingTop: 16,
      paddingBottom: 5,
      paddingRight: 16,
      paddingLeft: 16,

      backgroundColor: "rgba(0, 0, 0, 0.03)",
      borderTopRightRadius: 15,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,

      //so that the text does not go beyond the container
      flexGrow: 1,
      flex: 1,

      comment: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "400",
        color: "#212121",
        fontSize: 13,
        lineHeight: 18,
        color: "#212121",
      },
      time: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "400",
        color: "#212121",
        fontSize: 10,
        lineHeight: 12,
        color: "#BDBDBD",

        marginLeft: "auto",
        marginTop: 8,
        marginBottom: 15,
      },
    },
  },

  usersCommentContainerRight: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,

    userPhoto: {
      width: 40,
      height: 40,
      backgroundColor: "silver",
      borderRadius: 16,
      marginLeft: 15,
    },
    commentContainer: {
      paddingTop: 16,
      paddingBottom: 5,
      paddingRight: 16,
      paddingLeft: 16,

      backgroundColor: "rgba(0, 0, 0, 0.03)",
      borderTopLeftRadius: 15,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,

      //so that the text does not go beyond the container
      flexGrow: 1,
      flex: 1,

      comment: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "400",
        color: "#212121",
        fontSize: 13,
        lineHeight: 18,
        color: "#212121",
      },
      time: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: 10,
        lineHeight: 12,
        color: "#BDBDBD",

        marginRight: "auto",
        marginTop: 8,
        marginBottom: 15,
      },
    },
  },

  commentInput: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
    color: "#212121",

    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 15,
    paddingLeft: 15,

    backgroundColor: "#F6F6F6",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#E8E8E8",

    justifyContent: "center",
    alignItems: "center",

    button: {
      position: "absolute",
      right: 15,
      top: 13,

      justifyContent: "center",
      alignItems: "center",

      width: 34,
      height: 34,
      backgroundColor: "#FF6C00",
      borderRadius: 100,
    },
  },
});

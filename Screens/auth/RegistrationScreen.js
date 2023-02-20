import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  Pressable,
  TouchableOpacity,
  Image,
  Dimensions, //width/height screen view
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";

import { authSignUpUser } from "../../redux/auth/authOperations";
import { useDispatch } from "react-redux";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTogglePasswordVisibility } from "../../hooks/passwordVisibility";

const initialFormState = { name: "", email: "", password: "" };

export default function RegistrationScreen({ navigation }) {
  const [formState, setFormState] = useState(initialFormState);

  const [widthScreen, setWidthScreen] = useState(
    Dimensions.get("window").width
  );

  const dispatch = useDispatch();

  //password open/close logic, hook
  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  const handleFormSubmit = () => {
    Keyboard.dismiss();
    //user registration
    dispatch(authSignUpUser(formState));
    //reset registr form
    setFormState(initialFormState);
  };

  useEffect(() => {
    const onChangeScreenWidth = () => {
      const width = Dimensions.get("window").width;
      setWidthScreen(width);
    };
    Dimensions.addEventListener("change", onChangeScreenWidth);
    // return () => {
    //   Dimensions.removeEventListener('change', onChangeScreenWidth)
    // }
  }, []);

  const showImageAlert = () => {
    Alert.alert(
      "Photo settings",
      "In order to add a photo, you need to register.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ImageBackground
            style={styles.image}
            source={require("../../assets/images/bgimage.jpg")}
          >
            {/* <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : null}
              // behavior={Platform.OS === "ios" ? "padding" : "height"}
            > */}
            <View style={styles.form}>
              <View style={styles.userPhoto}>
                <TouchableOpacity onPress={showImageAlert}>
                  <Image
                    style={styles.addUserPhoto}
                    source={require("../../assets/images/adduserphoto.png")}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.title}>Registration</Text>
              <View style={styles.formBox}>
                <TextInput
                  style={{ ...styles.input, marginBottom: 15 }}
                  placeholder="Login"
                  placeholderTextColor="#BDBDBD"
                  name="name"
                  value={formState.name}
                  onChangeText={(value) =>
                    setFormState((prevState) => ({
                      ...prevState,
                      name: value,
                    }))
                  }
                />
                <TextInput
                  style={{ ...styles.input, marginBottom: 15 }}
                  placeholder="E-mail address"
                  placeholderTextColor="#BDBDBD"
                  name="email"
                  value={formState.email}
                  onChangeText={(value) =>
                    setFormState((prevState) => ({
                      ...prevState,
                      email: value,
                    }))
                  }
                />
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={{
                      ...styles.input,
                      marginBottom: 30,
                      flex: 1,
                      paddingRight: 35,
                    }}
                    placeholder="Password"
                    placeholderTextColor="#BDBDBD"
                    secureTextEntry={passwordVisibility}
                    name="password"
                    value={formState.password}
                    onChangeText={(value) =>
                      setFormState((prevState) => ({
                        ...prevState,
                        password: value,
                      }))
                    }
                  />
                  <Pressable
                    onPress={handlePasswordVisibility}
                    style={styles.inputIconShowPassword}
                  >
                    <MaterialCommunityIcons
                      name={rightIcon}
                      size={26}
                      color="#232323"
                    />
                  </Pressable>
                </View>

                {formState.email && formState.password && formState.name ? (
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={() => handleFormSubmit()}
                  >
                    <Text style={styles.button.title}>Registration</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{ ...styles.button, backgroundColor: "#F6F6F6" }}
                    activeOpacity={0.7}
                    onPress={() => handleFormSubmit()}
                    disabled={true}
                  >
                    <Text style={{ ...styles.button.title, color: "#BDBDBD" }}>
                      Registration
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.btnText}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={{ ...styles.btnText.text, marginTop: 15 }}>
                    Already have an account? Sign in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* </KeyboardAvoidingView> */}
          </ImageBackground>
        </TouchableWithoutFeedback>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  form: {
    backgroundColor: "#fff",
    height: 549,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,

    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  userPhoto: {
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: -80,
  },
  addUserPhoto: {
    width: 25,
    height: 25,
    top: 80,
    left: 105,
  },

  title: {
    width: 184,
    height: 35,
    fontFamily: "Roboto-Medium",
    fontStyle: "normal",
    fontWeight: "500",
    letterSpacing: 0.16,
    fontSize: 30,
    lineHeight: 35,
    textAlign: "center",
    color: "#212121",
    marginTop: 20,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 30,
  },
  formBox: {
    width: 350,
  },
  input: {
    fontFamily: "Roboto-Regular",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 19,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 10,
    padding: 16,
    backgroundColor: "#F6F6F6",
  },

  passwordContainer: {
    flexDirection: "row",
    borderColor: "#000",
    paddingBottom: 10,
  },
  inputIconShowPassword: {
    position: "absolute",
    flexDirection: "row",
    top: 17,
    right: 15,
  },

  button: {
    justifyContent: "center",
    alignItems: "center",

    paddingBottom: 16,
    paddingTop: 16,
    borderRadius: 100,
    backgroundColor: "#FF6C00",

    title: {
      fontFamily: "Roboto-Regular",
      fontStyle: "normal",
      fontWeight: "400",
      color: "#FFFFFF",
      fontSize: 16,
      lineHeight: 19,
    },
  },
  btnText: {
    marginRight: "auto",
    marginLeft: "auto",
    text: {
      textAlign: "center",
      fontFamily: "Roboto-Regular",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: 16,
      lineHeight: 19,
      color: "#1B4371",
    },
  },
});

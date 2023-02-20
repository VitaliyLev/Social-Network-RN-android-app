import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform, // platform ios/android
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTogglePasswordVisibility } from "../../hooks/passwordVisibility";

import { authSignInUser } from "../../redux/auth/authOperations";
import { useDispatch } from "react-redux";

const initialFormState = {
  email: "",
  password: "",
};

export default function LoginScreen({ navigation }) {
  const [formState, setFormState] = useState(initialFormState);
  const dispatch = useDispatch();

  const handleFormSubmit = () => {
    Keyboard.dismiss();
    dispatch(authSignInUser(formState));
    setFormState(initialFormState);
  };

  //password open/close logic, hook
  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ImageBackground
            style={styles.image}
            source={require("../../assets/images/bgimage.jpg")}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : null}
              // behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <View style={styles.form}>
                <Text style={styles.title}>Sign in</Text>
                <View>
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
                </View>

                {formState.email && formState.password ? (
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={() => handleFormSubmit()}
                  >
                    <Text style={styles.button.title}>Sign in</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{ ...styles.button, backgroundColor: "#F6F6F6" }}
                    activeOpacity={0.7}
                    onPress={() => handleFormSubmit()}
                    disabled={true}
                  >
                    <Text style={{ ...styles.button.title, color: "#BDBDBD" }}>
                      Sign in
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.btnText}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate("Registration")}
                >
                  <Text style={{ ...styles.btnText.text, marginTop: 15 }}>
                    Don't have an account? Register
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
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
    height: 450,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,

    padding: 20,
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
    marginTop: 32,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 32,
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
    marginLeft: "auto",
    marginRight: "auto",

    text: {
      fontFamily: "Roboto-Regular",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: 16,
      lineHeight: 19,
      color: "#1B4371",
    },
  },
});

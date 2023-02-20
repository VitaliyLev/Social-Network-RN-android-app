import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//auth
import LoginScreen from "./Screens/auth/LoginScreen";
import RegistrationScreen from "./Screens/auth/RegistrationScreen";

//tabs screen
import PostsScreen from "./Screens/mainScreen/PostsScreen";
import CreatePostsScreen from "./Screens/mainScreen/CreatePostsScreen";
import ProfileScreen from "./Screens/mainScreen/ProfileScreen";

//icons tabs navigation
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { View } from "react-native";

import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const AuthStack = createStackNavigator(); // Group navigators
const MainTab = createBottomTabNavigator(); // Bottom navigation

export default function useRoute(isAuth) {
  if (!isAuth) {
    //show this to an unregistered user
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <AuthStack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ headerShown: false }}
        />
      </AuthStack.Navigator>
    );
  }
  return (
    <MainTab.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "Roboto-Medium",
          fontSize: 17,
          fontWeight: "500",
          color: "#121212",
        },
        headerStyle: {},
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          height: 70,
          paddingBottom: 10,

          borderTopColor: "#B3B3B3",
        },
      }}
      barStyle={{ backgroundColor: "#694fad" }}
    >
      <MainTab.Screen
        name="PostsScreen"
        component={PostsScreen}
        options={({ route }) => ({
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";
            if (routeName === "CommentsScreen" || routeName === "MapScreen") {
              return { display: "none" };
            }
            return { height: 70, paddingBottom: 10 };
          })(route),

          headerShown: false,
          tabBarIcon: (focused, size, color) => (
            <Feather name="grid" size={24} color="#616161" />
          ),
        })}
      />

      <MainTab.Screen
        name="CreatePostsScreen"
        component={CreatePostsScreen}
        options={{
          headerShown: false,
          tabBarStyle: { display: "none" },
          tabBarIcon: (focused, size, color) => (
            <View
              style={{
                backgroundColor: "#FF6C00",
                borderRadius: 20,
                width: 70,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AntDesign name="plus" size={18} color="#fff" />
            </View>
          ),
        }}
      />

      <MainTab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: (focused, size, color) => (
            <AntDesign name="user" size={24} color="#616161" />
          ),
        }}
      />
    </MainTab.Navigator>
  );
}

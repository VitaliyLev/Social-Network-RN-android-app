import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import DefaultPostsScreen from "../nestedScreens/DefaultPostsScreen";
import MapScreen from "../nestedScreens/MapScreen";
import CommentsScreen from "../nestedScreens/CommentsScreen";

const NestedScreen = createStackNavigator();

export default function PostsScreen() {
  return (
    <NestedScreen.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
      }}
    >
      <NestedScreen.Screen
        name="DefaultPostsScreen"
        component={DefaultPostsScreen}
        options={{
          headerTitleAlign: "center",
          title: "Publications",
          headerTitleStyle: {
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "600",
            fontSize: 17,
            lineHeight: 22,
            color: "#212121",
          },
        }}
      />

      <NestedScreen.Screen
        name="CommentsScreen"
        component={CommentsScreen}
        options={{
          headerTitleAlign: "center",
          title: "Comments",
          headerTitleStyle: {
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "600",
            fontSize: 17,
            lineHeight: 22,
            color: "#212121",
          },
        }}
      />

      <NestedScreen.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          headerTitleAlign: "center",
          title: "Location",
          headerTitleStyle: {
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "600",
            fontSize: 17,
            lineHeight: 22,
            color: "#212121",
          },
        }}
      />
    </NestedScreen.Navigator>
  );
}

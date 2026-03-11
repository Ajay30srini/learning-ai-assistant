import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import HomeScreen from "../Screens/HomeScreen";
import ChatScreen from "../Screens/ChatScreen";
import UploadScreen from "../Screens/UploadScreen";
import TutorScreen from "../Screens/TutorScreen";
import QuizScreen from "../Screens/QuizScreen";
import ScoreScreen from "../Screens/ScoreScreen";

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Upload" component={UploadScreen} />
      <Drawer.Screen name="Tutor" component={TutorScreen} />
      <Drawer.Screen name="Chatbot" component={ChatScreen} />
      <Drawer.Screen name="Quiz" component={QuizScreen} />
      <Drawer.Screen name="Score" component={ScoreScreen} />
    </Drawer.Navigator>
  );
}
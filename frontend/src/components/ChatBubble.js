import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export default function ChatBubble({ message, isUser }) {
  return (
    <View
      style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.botBubble
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    maxWidth: "75%"
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.cta
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  text: {
    color: "#000"
  }
});
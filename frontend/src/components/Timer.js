import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export default function Timer({ time }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Time Left: {time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: COLORS.honey,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 20
  },
  text: {
    color: COLORS.white,
    fontWeight: "bold"
  }
});
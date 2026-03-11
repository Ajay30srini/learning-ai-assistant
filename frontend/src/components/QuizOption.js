import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export default function QuizOption({ option, onPress }) {
  return (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <Text style={styles.text}>{option}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  text: {
    fontSize: 16
  }
});
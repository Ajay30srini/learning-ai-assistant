import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/colors";
import CourseCard from "../components/CourseCard";

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Learning Dashboard</Text>

      <Text style={styles.section}>Available Courses</Text>

      <CourseCard
        title="Artificial Intelligence Basics"
        onPress={() => navigation.navigate("Chat")}
      />

      <CourseCard
        title="Java Programming"
        onPress={() => navigation.navigate("Quiz")}
      />

      <CourseCard
        title="Machine Learning Fundamentals"
        onPress={() => navigation.navigate("Chat")}
      />

      <Text style={styles.section}>Actions</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Upload")}
      >
        <Text style={styles.buttonText}>Upload Course Document</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Quiz")}
      >
        <Text style={styles.buttonText}>Start Quiz</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.darkBlue,
    marginBottom: 20
  },

  section: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 10,
    color: COLORS.silver
  },

  button: {
    backgroundColor: COLORS.cta,
    padding: 15,
    borderRadius: 10,
    marginVertical: 10
  },

  buttonText: {
    color: COLORS.white,
    textAlign: "center",
    fontSize: 16
  }
});
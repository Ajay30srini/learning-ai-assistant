import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { COLORS } from "../constants/colors";

export default function ScoreScreen({ route, navigation }) {
  const { score = 0, total = 0, quiz, selectedAnswers = {} } = route.params || {};

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>Quiz Result</Text>

      <View style={styles.scoreCard}>
        <Text style={styles.scoreText}>
          Score: {score} / {total}
        </Text>
        <Text style={styles.percentageText}>{percentage}%</Text>
      </View>

      {quiz?.questions?.map((q, index) => {
        const selected = selectedAnswers[index];
        const correct = q.answer;
        const isCorrect = selected === correct;

        return (
          <View key={index} style={styles.questionCard}>
            <Text style={styles.questionText}>
              Q{index + 1}. {q.question}
            </Text>

            <Text style={styles.label}>Your Answer:</Text>
            <Text style={[styles.answerText, isCorrect ? styles.correct : styles.wrong]}>
              {selected || "Not Answered"}
            </Text>

            {!isCorrect && (
              <>
                <Text style={styles.label}>Correct Answer:</Text>
                <Text style={[styles.answerText, styles.correct]}>{correct}</Text>
              </>
            )}
          </View>
        );
      })}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Quiz")}
      >
        <Text style={styles.buttonText}>Back to Quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.darkBlue,
    marginBottom: 20,
  },
  scoreCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.darkBlue,
  },
  percentageText: {
    marginTop: 8,
    fontSize: 18,
    color: COLORS.cta,
    fontWeight: "600",
  },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#222",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
    color: "#374151",
  },
  answerText: {
    marginTop: 4,
    fontSize: 15,
  },
  correct: {
    color: "#15803d",
    fontWeight: "600",
  },
  wrong: {
    color: "#b91c1c",
    fontWeight: "600",
  },
  button: {
    marginTop: 10,
    backgroundColor: COLORS.cta,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
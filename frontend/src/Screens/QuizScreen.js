import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
import { generateQuiz } from "../service/quizApi";

export default function QuizScreen() {
  const navigation = useNavigation();

  const [topic, setTopic] = useState("");
  const [sourceMode, setSourceMode] = useState("general");
  const [difficulty, setDifficulty] = useState("easy");
  const [quizType, setQuizType] = useState("mcq");
  const [numQuestions, setNumQuestions] = useState("5");

  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const sourceModes = ["general", "document"];
  const difficulties = ["easy", "medium", "hard"];
  const quizTypes = ["mcq", "true_false", "short_answer"];

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      Alert.alert("Validation", "Please enter a topic.");
      return;
    }

    try {
      setLoading(true);
      setQuizData(null);
      setSelectedAnswers({});
      setSubmitted(false);

      const payload = {
        topic,
        source_mode: sourceMode,
        num_questions: parseInt(numQuestions, 10) || 5,
        difficulty,
        quiz_type: quizType,
        session_id: "ajay",
      };

      const response = await generateQuiz(payload);

      const normalizedQuiz = response.quiz ? response.quiz : response;
      setQuizData(normalizedQuiz);
    } catch (error) {
      Alert.alert("Quiz Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionIndex, option) => {
    if (submitted) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!quizData?.questions?.length) {
      Alert.alert("No Quiz", "Please generate a quiz first.");
      return;
    }

    let score = 0;

    quizData.questions.forEach((q, index) => {
      const selected = selectedAnswers[index];
      if (selected && selected === q.answer) {
        score += 1;
      }
    });

    setSubmitted(true);

    navigation.navigate("Score", {
      score,
      total: quizData.questions.length,
      quiz: quizData,
      selectedAnswers,
    });
  };

  const renderOption = (question, option, questionIndex) => {
    const selected = selectedAnswers[questionIndex] === option;
    const correctAnswer = question.answer;

    let optionStyle = [styles.optionButton];
    let optionTextStyle = [styles.optionText];

    if (submitted) {
      if (option === correctAnswer) {
        optionStyle.push(styles.correctOption);
        optionTextStyle.push(styles.correctOptionText);
      } else if (selected && option !== correctAnswer) {
        optionStyle.push(styles.wrongOption);
        optionTextStyle.push(styles.wrongOptionText);
      } else if (selected) {
        optionStyle.push(styles.selectedOption);
      }
    } else if (selected) {
      optionStyle.push(styles.selectedOption);
    }

    return (
      <TouchableOpacity
        key={option}
        style={optionStyle}
        onPress={() => handleOptionSelect(questionIndex, option)}
        disabled={submitted}
      >
        <View style={styles.radioOuter}>
          {selected && <View style={styles.radioInner} />}
        </View>
        <Text style={optionTextStyle}>{option}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>Quiz Generator</Text>

      <Text style={styles.label}>Topic</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter topic"
        value={topic}
        onChangeText={setTopic}
      />

      <Text style={styles.label}>Source Mode</Text>
      <View style={styles.rowWrap}>
        {sourceModes.map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[
              styles.chip,
              sourceMode === mode && styles.activeChip,
            ]}
            onPress={() => setSourceMode(mode)}
          >
            <Text
              style={[
                styles.chipText,
                sourceMode === mode && styles.activeChipText,
              ]}
            >
              {mode}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Difficulty</Text>
      <View style={styles.rowWrap}>
        {difficulties.map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.chip,
              difficulty === level && styles.activeChip,
            ]}
            onPress={() => setDifficulty(level)}
          >
            <Text
              style={[
                styles.chipText,
                difficulty === level && styles.activeChipText,
              ]}
            >
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Quiz Type</Text>
      <View style={styles.rowWrap}>
        {quizTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.chip,
              quizType === type && styles.activeChip,
            ]}
            onPress={() => setQuizType(type)}
          >
            <Text
              style={[
                styles.chipText,
                quizType === type && styles.activeChipText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Number of Questions</Text>
      <TextInput
        style={styles.input}
        placeholder="5"
        keyboardType="numeric"
        value={numQuestions}
        onChangeText={setNumQuestions}
      />

      <TouchableOpacity style={styles.generateButton} onPress={handleGenerateQuiz}>
        <Text style={styles.generateButtonText}>Generate Quiz</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="small" color={COLORS.cta} style={{ marginTop: 16 }} />
      )}

      {quizData?.questions?.length > 0 && (
        <View style={styles.quizContainer}>
          <Text style={styles.quizHeading}>
            Topic: {quizData.topic || topic}
          </Text>

          {quizData.questions.map((question, questionIndex) => (
            <View key={questionIndex} style={styles.questionCard}>
              <Text style={styles.questionText}>
                Q{questionIndex + 1}. {question.question}
              </Text>

              {question.options?.map((option) =>
                renderOption(question, option, questionIndex)
              )}

              {submitted &&
                selectedAnswers[questionIndex] &&
                selectedAnswers[questionIndex] !== question.answer && (
                  <Text style={styles.correctAnswerText}>
                    Correct Answer: {question.answer}
                  </Text>
                )}

              {submitted && !selectedAnswers[questionIndex] && (
                <Text style={styles.correctAnswerText}>
                  Correct Answer: {question.answer}
                </Text>
              )}
            </View>
          ))}

          {!submitted && (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitQuiz}>
              <Text style={styles.submitButtonText}>Submit Quiz</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.darkBlue,
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.darkBlue,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 10,
    padding: 12,
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
    marginRight: 8,
    marginBottom: 8,
  },
  activeChip: {
    backgroundColor: COLORS.cta,
  },
  chipText: {
    color: "#333",
    fontWeight: "500",
  },
  activeChipText: {
    color: "#fff",
  },
  generateButton: {
    marginTop: 18,
    backgroundColor: COLORS.cta,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  generateButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  quizContainer: {
    marginTop: 24,
  },
  quizHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkBlue,
    marginBottom: 12,
  },
  questionCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#222",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#f9fafb",
  },
  selectedOption: {
    borderColor: COLORS.cta,
    backgroundColor: "#dbeafe",
  },
  correctOption: {
    borderColor: "#16a34a",
    backgroundColor: "#dcfce7",
  },
  wrongOption: {
    borderColor: "#dc2626",
    backgroundColor: "#fee2e2",
  },
  optionText: {
    color: "#222",
    flex: 1,
  },
  correctOptionText: {
    color: "#166534",
    fontWeight: "600",
  },
  wrongOptionText: {
    color: "#991b1b",
    fontWeight: "600",
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#555",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.cta,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  correctAnswerText: {
    marginTop: 8,
    color: "#166534",
    fontWeight: "600",
  },
});
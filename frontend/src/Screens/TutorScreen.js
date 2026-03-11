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
import { COLORS } from "../constants/colors";
import { askTutor } from "../service/tutorApi";

export default function TutorScreen() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAskTutor = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);
      const res = await askTutor(question, "ajay");
      setAnswer(res.answer || "");
      setSources(res.sources || []);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AI Tutor</Text>

      <TextInput
        style={styles.input}
        placeholder="Ask from uploaded document..."
        value={question}
        onChangeText={setQuestion}
      />

      <TouchableOpacity style={styles.button} onPress={handleAskTutor}>
        <Text style={styles.buttonText}>Ask Tutor</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 15 }} />}

      {!!answer && (
        <View style={styles.answerBox}>
          <Text style={styles.sectionTitle}>Answer</Text>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}

      {sources.length > 0 && (
        <View style={styles.sourcesBox}>
          <Text style={styles.sectionTitle}>Sources</Text>
          {sources.map((source, index) => (
            <View key={index} style={styles.sourceItem}>
              <Text style={styles.sourceTitle}>
                {source.doc_name} - Page {source.page}
              </Text>
              <Text style={styles.sourceText}>{source.chunk_text}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", color: COLORS.darkBlue, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: { backgroundColor: COLORS.cta, padding: 12, borderRadius: 8 },
  buttonText: { color: COLORS.white, textAlign: "center", fontWeight: "600" },
  answerBox: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },
  sourcesBox: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  answerText: { color: "#111827", lineHeight: 22 },
  sourceItem: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  sourceTitle: { fontWeight: "600", marginBottom: 6 },
  sourceText: { color: "#374151" },
});
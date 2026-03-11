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
import { askChatbot } from "../service/chatbotApi";

export default function ChatScreen() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim()) {
      Alert.alert("Validation", "Please enter a message.");
      return;
    }

    const userMessage = {
      type: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      setLoading(true);

      const response = await askChatbot(question, "ajay");

      const botMessage = {
        type: "bot",
        text: response.answer || "No response received.",
      };

      setMessages((prev) => [...prev, botMessage]);
      setQuestion("");
    } catch (error) {
      Alert.alert("Chatbot Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Chatbot</Text>

      <ScrollView style={styles.chatArea} contentContainerStyle={{ paddingBottom: 20 }}>
        {messages.length === 0 && (
          <Text style={styles.placeholderText}>
            Start a conversation with the AI chatbot.
          </Text>
        )}

        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBox,
              msg.type === "user" ? styles.userBox : styles.botBox,
            ]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}

        {loading && (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="small" color={COLORS.cta} />
          </View>
        )}
      </ScrollView>

      <TextInput
        style={styles.input}
        placeholder="Ask anything..."
        value={question}
        onChangeText={setQuestion}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 12,
  },
  chatArea: {
    flex: 1,
    marginBottom: 12,
  },
  placeholderText: {
    color: "#666",
    marginTop: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 10,
    padding: 12,
    minHeight: 60,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  button: {
    backgroundColor: COLORS.cta,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 16,
  },
  messageBox: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: "85%",
  },
  userBox: {
    backgroundColor: "#dbeafe",
    alignSelf: "flex-end",
  },
  botBox: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#222",
    lineHeight: 20,
  },
  loadingWrapper: {
    marginTop: 10,
    alignItems: "center",
  },
});
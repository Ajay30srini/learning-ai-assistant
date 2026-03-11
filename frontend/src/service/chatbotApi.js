import { API_BASE_URL } from "./api";

export async function askChatbot(question, sessionId = "ajay") {
  const response = await fetch(`${API_BASE_URL}/chatbot/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      session_id: sessionId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Chatbot request failed");
  }

  return data;
}
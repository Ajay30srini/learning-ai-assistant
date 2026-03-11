import { API_BASE_URL } from "./api";

export async function askTutor(question, sessionId = "ajay") {
  const response = await fetch(`${API_BASE_URL}/tutor/chat`, {
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
    throw new Error(data.detail || "Tutor request failed");
  }

  return data;
}
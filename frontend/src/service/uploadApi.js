import { Platform } from "react-native";
import { API_BASE_URL } from "./api";

export async function uploadDocument(file) {
  const formData = new FormData();

  if (Platform.OS === "web") {
    // Expo web document picker usually provides a real File object here
    if (file.file) {
      formData.append("file", file.file, file.name);
    } else {
      throw new Error("Web upload failed: file object not found.");
    }
  } else {
    // Android / iOS
    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || "application/pdf",
    });
  }

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      // don't manually set Content-Type for FormData
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || JSON.stringify(data) || "Upload failed");
  }

  return data;
}
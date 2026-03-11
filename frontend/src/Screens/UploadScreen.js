import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { COLORS } from "../constants/colors";
import { uploadDocument } from "../service/uploadApi";

export default function UploadScreen() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const pickDocument = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ],
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      console.log("Picked file:", result.assets[0]);
      setFile(result.assets[0]);
      setUploadResult(null);
    }
  } catch (error) {
    Alert.alert("Error", "Failed to pick document.");
  }
};

  const handleUpload = async () => {
    if (!file) {
      Alert.alert("No File", "Please select a document first.");
      return;
    }

    try {
      setLoading(true);
      const response = await uploadDocument(file);
      setUploadResult(response);

      Alert.alert(
        "Upload Success",
        `${response.filename} uploaded and indexed successfully.`
      );
    } catch (error) {
      Alert.alert("Upload Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Course Document</Text>

      <TouchableOpacity style={styles.uploadBox} onPress={pickDocument}>
        <Text style={styles.uploadText}>
          {file ? `Selected: ${file.name}` : "Select PDF / DOCX / TXT"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleUpload} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Upload & Index</Text>
        )}
      </TouchableOpacity>

      {uploadResult && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Upload Result</Text>
          <Text style={styles.resultText}>Filename: {uploadResult.filename}</Text>
          <Text style={styles.resultText}>Document ID: {uploadResult.doc_id}</Text>
          <Text style={styles.resultText}>
            Chunks Indexed: {uploadResult.chunks_indexed}
          </Text>
        </View>
      )}
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
    marginBottom: 20,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  uploadText: {
    color: COLORS.darkBlue,
    fontSize: 15,
    textAlign: "center",
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
  resultCard: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  resultTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.darkBlue,
  },
  resultText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
});
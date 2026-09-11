import FileUploader from "@/components/FileUploader";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function App() {
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(
    null,
  );
  return (
    <View style={styles.container}>
      <FileUploader onFileSelected={setFile} />

      {file && <Text>File name: {file.name}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});

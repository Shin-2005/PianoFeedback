import { Pressable, StyleSheet, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";

type FileUploaderProps = {
  onFileSelected: (file: DocumentPicker.DocumentPickerAsset) => void;
};

export default function FileUploader(props: FileUploaderProps) {
  const handleUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/midi",
    });
    if (result.canceled) {
      return;
    }
    props.onFileSelected(result.assets[0]);
  };

  return (
    <View>
      <Pressable style={styles.uploadBtn} onPress={handleUpload}>
        <Text style={styles.btnTxt}>Upload MIDI File</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  uploadBtn: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  btnTxt: {
    color: "#ffffff",
  },
});

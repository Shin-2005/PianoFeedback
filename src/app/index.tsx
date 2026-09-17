import FileUploader from "@/components/FileUploader";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { File } from 'expo-file-system';
import parseMIDI from '../lib/parser';
import { Note } from '../lib/types';
import { useMIDIInput } from "@/hooks/use-midi-input";

export default function App() {
  const [asset, setAsset] = useState<DocumentPicker.DocumentPickerAsset | null>(
    null,
  );
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const playedNotes = useMIDIInput();

  const handleFileSelected = async (file: DocumentPicker.DocumentPickerAsset) => {
    setError(null);

    try {
      const bytes = await new File(file.uri).bytes();
      const parsedNotes = parseMIDI(bytes); 
      setAsset(file);
      setNotes(parsedNotes)
    } catch {
      setError("Couldn't read MIDI File");
    }
  }

  return (
    <View style={styles.container}>
      <FileUploader onFileSelected={handleFileSelected} />

      {asset && <Text style={ {color: 'white'}}>File name: {asset.name} - {notes?.length}</Text>}
      {error && <Text style={styles.errorMsg}>{error}</Text>}
      <Text style={{ color: 'white' }}>Notes played: {playedNotes.length}</Text>
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
  errorMsg: {
    color: "red",
  },
});

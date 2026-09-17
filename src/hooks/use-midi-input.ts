import { useEffect, useState } from "react";
import { requestMIDIAccess, MIDIMessageEvent } from "react-native-midi-api";
import { Note } from "../lib/types";
import decodeNote from "../lib/decodeNote";

// react-native-midi-api's MIDIMessageEvent.d.ts is missing 'timeStamp'
// Explicitly declare it here to patch this bug
type TimedMIDIMessageEvent = MIDIMessageEvent & { timeStamp: number };

export function useMIDIInput() {
  const [playedNotes, setPlayedNotes] = useState<Note[]>([]);

  useEffect(() => {
    let cancelled = false;
    let midi: Awaited<ReturnType<typeof requestMIDIAccess>>| null = null;

    const setup = async () => {
      try {
        midi = await requestMIDIAccess();
        if (cancelled) {
          return;
        }
      
        for (const input of midi.inputs.values()) {
          input.onmidimessage = (event: MIDIMessageEvent) =>  {
            const { timeStamp } = event as TimedMIDIMessageEvent;
            const note = decodeNote(event.data, timeStamp);
            if (note) {
              setPlayedNotes(prev => [...prev, note]);
            }
          }
        }
      } catch (err) {
        console.log("failed", err);
      }
    }

    setup();

    return () => {
      cancelled = true;
      if (midi !== null) {
        for (const input of midi.inputs.values()) {
          input.onmidimessage = null;
        }
      }
    };
  }, []);

  return playedNotes;
}
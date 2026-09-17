import { Note } from "./types";

export default function decodeNote(data: Uint8Array, timeStamp: number): Note | null {
  const status = data[0];
  const pitch = data[1];
  const velocity = data[2];

  // Ignore anything that isn't a key press
  if (status < 144 || status > 159 || velocity === 0) {
    return null;
  }

  return {
    pitch,
    start: timeStamp
  }
}
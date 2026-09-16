import { Midi } from '@tonejs/midi';
import { Note } from './types';

export default function parseMIDI(bytes: Uint8Array): Note[] {
  const midi = new Midi(bytes);

  return midi.tracks
    .filter(track => track.channel !== 9)
    .flatMap(track => track.notes)
    .filter(note => note.midi >= 21 && note.midi <= 108)
    .sort((a,b) => a.time - b.time)
    .map(note => ({
      pitch: note.midi,
      start: note.time,
    }));
}
import parseMIDI from './parser';
import { Midi } from '@tonejs/midi';

describe('parseMIDI', () => {
  test('parses notes from a normal track', () => {
    const midi = new Midi();
    const track = midi.addTrack();
    track.channel = 0;
    track.addNote({ midi: 60, time: 0, duration: 0.5 });
    track.addNote({ midi: 64, time: 0.5, duration: 0.5 });

    const result = parseMIDI(midi.toArray());

    expect(result).toHaveLength(2);
    expect(result[0].pitch).toBe(60);
    expect(result[1].pitch).toBe(64);
  });

  test('percussion channel is omitted', () => {
    const midi = new Midi();
    const track = midi.addTrack();
    track.channel = 9;
    track.addNote({ midi: 60, time: 0, duration: 0.5 });
    track.addNote({ midi: 64, time: 0.5, duration: 0.5 });

    const result = parseMIDI(midi.toArray());

    expect(result).toHaveLength(0);
  });

  test('notes out of range are omitted', () => {
    const midi = new Midi();
    const track = midi.addTrack();
    track.channel = 0;
    track.addNote({ midi: 20, time: 0, duration: 0.5 });
    track.addNote({ midi: 21, time: 0.5, duration: 0.5 });
    track.addNote({ midi: 108, time: 1.0, duration: 0.5 });
    track.addNote({ midi: 109, time: 1.5, duration: 0.5 });

    const result = parseMIDI(midi.toArray());

    expect(result).toHaveLength(2);
    expect(result[0].pitch).toBe(21);
    expect(result[1].pitch).toBe(108);
  });

  test('two tracks interleaved', () => {
    const midi = new Midi();
    const track1 = midi.addTrack();
    const track2 = midi.addTrack();
    track1.channel = 0;
    track2.channel = 0;
    track1.addNote({ midi: 60, time: 0, duration: 0.5 });
    track2.addNote({ midi: 61, time: 0.5, duration: 0.5 });
    track1.addNote({ midi: 62, time: 1.0, duration: 0.5 });

    const result = parseMIDI(midi.toArray());

    expect(result).toHaveLength(3);
    expect(result[0].pitch).toBe(60);
    expect(result[1].pitch).toBe(61);
    expect(result[2].pitch).toBe(62);
  });
});
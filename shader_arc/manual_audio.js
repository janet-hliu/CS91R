// human readable live sequence with note name, modification, and octave
var live_sequence = "";

var audioContext;
var oscillator;
var NOTE_DURATION = 40;

// returns a Promise that resolves after "ms" Milliseconds
// used for playing manual sequences
const timer = ms => new Promise(res => setTimeout(res, ms))

// gets or creates an audio context
function getOrCreateContext() {
	if (!audioContext) {
		audioContext = new AudioContext();
		oscillator = audioContext.createOscillator();
		oscillator.connect(audioContext.destination);
		oscillator.start();
	} else {
		audioContext.resume();
	}
	return audioContext;	
}

async function updateSeq(pattern_tracker, input_sequence) {
	console.log("in update sequence");
	console.log(pattern_tracker);
	// clear all old sequence information
	getOrCreateContext();
	live_sequence = "";
	pattern_tracker.clear();
	var seq_arr = [];
  
	// load midi file into pattern tracker
	if (input_sequence.includes(".mid")) {
	  	readMidi(url, async function(song) {
			seq_arr = render(song);
			// convert midi notes into ascii codes
			for (let i = 0; i < seq_arr.length; i++) {
				let midi_num = seq_arr[i];
				let ascii_rep = String.fromCharCode(seq_arr[i]);
				let freq = Math.pow(2, (midi_num-69)/12)*440;
				oscillator.frequency.setTargetAtTime(freq, audioContext.currentTime, 0);
		
				pattern_tracker.addNote(ascii_rep, row, col);
		
				await timer(NOTE_DURATION);
			}
			is_currently_playing = false;
			audioContext.suspend()
	  	});
	} else {
		// iterate through manual input sequence, find midi note name and number
		for (i = 0; i < input_sequence.length; i += 3) {
			let curr_note = ""
			if (input_sequence[i+1] == "n") {
				curr_note = input_sequence[i] + input_sequence[i+2]
			} else {
				curr_note = input_sequence.substring(i, i+3)
			}
			let midi_num = Utilities.guessNoteNumber(curr_note);
			let ascii_rep = String.fromCharCode(midi_num);
			let freq = Math.pow(2, (midi_num-69)/12)*440;
			oscillator.frequency.setTargetAtTime(freq, audioContext.currentTime, 0);
	
			pattern_tracker.addNote(ascii_rep, row, col);
			live_sequence = live_sequence.concat(curr_note);
	
			await timer(NOTE_DURATION);
		}
		audioContext.suspend()
	}
  }
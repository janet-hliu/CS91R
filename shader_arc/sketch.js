let screen;
let myShader;
let backgroundCol = "#001524";

var pattern_tracker;

var input;
var live_sequence = "";
var manualButton;
var liveButton;
var audioContext;
var oscillator;
var NOTE_DURATION = 100;

var chord_handler = new Set();
var last_timestamp = 0.0;
const CHORD_LEEWAY = 15;
var START_TIME = 0.0;
var first_note = true;

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

// triggered when WEBMIDI.js is ready
function onEnabled() {
	// Inputs
	WebMidi.inputs.forEach(input => console.log(input.manufacturer, input.name));
	// Outputs
	WebMidi.outputs.forEach(output => console.log(output.manufacturer, output.name));
  
	// Display available MIDI input devices
	// if (WebMidi.inputs.length < 1) {
	// 	document.body.innerHTML+= "No device detected.";
	// } else {
	// 	WebMidi.inputs.forEach((device, index) => {
	// 		document.body.innerHTML+= `${index}: ${device.name} <br>`;
	// 	});
	// }
  
	// jeff's piano shows all info coming from channel 16: display e.message.channel
	const mySynth = WebMidi.inputs[0].channels[1];
	// console.log(WebMidi.inputs[0]);
  
	mySynth.addListener("noteon", e => {
		// e.note.number is a number from 0 - 127, representing full MIDI range
		// add 32 to avoid the unprintable ascii characters
		// var ascii_rep = String.fromCharCode(e.note.number + 32);
		if (first_note) {
			first_note = false;
			START_TIME = Date.now() - e.timestamp;
		}

		// if new note N is within CHORD_LEEWAY milliseconds from previous note, consider them part of the same chord
		// add N to chord handler set, but do not add to pattern tracker
		if ((e.timestamp - last_timestamp) < CHORD_LEEWAY) {
			// console.log(last_timestamp);
			chord_handler.add(e.note.number);
			// console.log("in if");
			// console.log(chord_handler);
		} else {
			// chords exist:
			// find highest note in chord, add that to pattern tracker
			if (chord_handler.size != 0) {
				var highest_note = Math.max.apply(Math, [...chord_handler]);
				var highest_ascii_rep = String.fromCharCode(highest_note + 32);
				pattern_tracker.addNote(highest_ascii_rep, width, height);
				chord_handler.clear();
			}
			// leeway passed, adding note that is no longer part of chord
			// it will get processed upon the next note
			if (chord_handler.size == 0) {
				chord_handler.add(e.note.number);
			}
		}

		last_timestamp = e.timestamp;
		// document.getElementById("live_sequence").innerHTML = live_sequence;
	})
}

async function updateSeq() {
	// clear all old sequence information
	getOrCreateContext();
	live_sequence = "";
	pattern_tracker.clear();
	let input_sequence = input.value();
	var seq_arr = [];
  
	// load midi file into pattern tracker
	if (input_sequence.includes(".mid")) {
	  readMidi(url, async function(song) {
		seq_arr = render(song);
		// convert midi notes into ascii codes
		for (let i = 0; i < seq_arr.length; i++) {
		  let midi_num = seq_arr[i];
		  let ascii_rep = String.fromCharCode(seq_arr[i]);
		  let freq = Math.pow(2, (midi_num-69)/12) * 440;
		  oscillator.frequency.setTargetAtTime(freq, audioContext.currentTime, 0);
  
		  pattern_tracker.addNote(ascii_rep, width, height);
  
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

			pattern_tracker.addNote(ascii_rep, width, height);
			live_sequence = live_sequence.concat(curr_note);

			await timer(NOTE_DURATION);
		}
	  	audioContext.suspend()
	}
  }

function setup() {
	pixelDensity(1);
	createCanvas(windowWidth, windowHeight, WEBGL);
	screen = createGraphics(width, height, WEBGL);
	myShader = createShader(vertShader, fragShader);
	shader(myShader);
	screen.background(backgroundCol)

	// pattern rendering
	pattern_tracker = new Pattern([], "", width, height);

	myShader.setUniform('texture', screen);
	myShader.setUniform('y_height', pattern_tracker.getBaseHeight());

	// manual input
	// input = createInput('Cn3Dn3En3Gn5Cn3Dn3En3');
	// input.position(20, 65);
	// manualButton = createButton('submit');
	// manualButton.position(input.x + input.width, 65);
	// manualButton.mousePressed(updateSeq);

	// live input
	// liveButton = createButton('live');
	// liveButton.position(manualButton.x  + manualButton.width, 65);
	WebMidi
		.enable()
		.then(onEnabled)
		.catch(err => alert(err));
	// setup to enable WebMidi library: https://webmidijs.org/docs/
	// liveButton.mousePressed(function() {
	// 	WebMidi
	// 	.enable()
	// 	.then(onEnabled)
	// 	.catch(err => alert(err));
	// 	pattern_tracker.clear();
	// 	live_sequence = "";
	// })

	// renderMidiTracks();
}

function draw() {
	if (chord_handler.size != 0 && ((Date.now() - START_TIME) - last_timestamp) >= CHORD_LEEWAY) {
		var highest_note = Math.max.apply(Math, [...chord_handler]);
		var highest_ascii_rep = String.fromCharCode(highest_note + 32);
		pattern_tracker.addNote(highest_ascii_rep, width, height);
		chord_handler.clear();
	}

	let shaderParticles = pattern_tracker.getNotes();
	let [arcs, progress] = pattern_tracker.getArcs();

	myShader.setUniform('numArcs', pattern_tracker.getNumArcs());
	myShader.setUniform('numParticles', pattern_tracker.getNumNotes());
	myShader.setUniform('particles', shaderParticles);
	myShader.setUniform('arcs', arcs);
	myShader.setUniform('arcProgress', progress);
	rect(0, 0, width, height);
}
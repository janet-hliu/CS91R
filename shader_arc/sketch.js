let screen;
let myShader;
let backgroundCol = "#001524";

var pattern_tracker;

var input;
var manualButton;
var liveButton;
var audioContext;
var oscillator;
var NOTE_DURATION = 400;

// returns a Promise that resolves after "ms" Milliseconds
// used for playing manual sequences
const timer = ms => new Promise(res => setTimeout(res, ms))

// let numParticles = 20;
// let particles = [];

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
	if (WebMidi.inputs.length < 1) {
		document.body.innerHTML+= "No device detected.";
	} else {
		WebMidi.inputs.forEach((device, index) => {
			document.body.innerHTML+= `${index}: ${device.name} <br>`;
		});
	}
  
	// jeff's piano shows all info coming from channel 16: display e.message.channel
	const mySynth = WebMidi.inputs[0].channels[16];
  
	mySynth.addListener("noteon", e => {
		// e.note.number is a number from 0 - 127, representing full MIDI range
		var ascii_rep = String.fromCharCode(e.note.number)

		pattern_tracker.addNote(ascii_rep, width, height);
		live_sequence = live_sequence.concat(e.note.identifier);
		document.getElementById("live_sequence").innerHTML = live_sequence;
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
	pattern_tracker = new Pattern([], "");

	// manual input
	input = createInput('Cn3Dn3En3Gn5Gn5Cn3Dn3En3Cn3Dn3En3Gn5Gn5Cn3Dn3En3');
	input.position(20, 65);
	manualButton = createButton('submit');
	manualButton.position(input.x + input.width, 65);
	manualButton.mousePressed(updateSeq);

	// live input
	liveButton = createButton('live');
	liveButton.position(manualButton.x  + manualButton.width, 65);
	// setup to enable WebMidi library: https://webmidijs.org/docs/
	liveButton.mousePressed(function() {
		WebMidi
		.enable()
		.then(onEnabled)
		.catch(err => alert(err));
	})

	renderMidiTracks();
}

function draw() {
	let shaderParticles = []
	var numParticles = 0
	pattern_tracker.getNotes().forEach(function(note) {
		numParticles += 1;
		note.update(0);
		shaderParticles.push(note.curPos.x);
		shaderParticles.push(note.curPos.y);
	  })
	console.log(shaderParticles);
	console.log(numParticles);
	
	myShader.setUniform('numParticles', numParticles);
	myShader.setUniform('particles', shaderParticles);
	myShader.setUniform('texture', screen);
	myShader.setUniform('time', 0.0005*millis());
	rect(-width/2, -height/2, width, height);
}
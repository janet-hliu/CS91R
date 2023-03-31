// Cn3Dn3En3Gn5Gn5Cn3Dn3En3Cn3Dn3En3Gn5Gn5Cn3Dn3En3
var backgroundBlues = ["#001219", "#001524", "#003049", "#335C67", "#15616D", "#293241"];
var lumens = ["#D5C8DC", "#CDB4DB","#B5838D", "#D6AAB3", "#E6C7D3", "#DDC0C1", "#E5989B",
              "#3d5a80", "#00B4D8","#48CAE4", "#98C1D9", "#ADE8F4", "#e0fbfc", 
              "#005FA4", "#0085D7", "#0090ED", "#00EDFF",
              "#E77F65", "#F5EBB5", "#FFECD1"];
var pattern_tracker;

// human readable live sequence with note name, modification, and octave
var live_sequence = "";

var input;
var manualButton;
var liveButton;
var audioContext;
var oscillator;

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
  if (WebMidi.inputs.length < 1) {
    document.body.innerHTML+= "No device detected.";
  } else {
    WebMidi.inputs.forEach((device, index) => {
      document.body.innerHTML+= `${index}: ${device.name} <br>`;
    });
  }

  // jeff's piano shows all info coming from channel 16: display e.message.channel
  const mySynth = WebMidi.inputs[0].channels[16];

  // NEW NOTE, continue to modify
  mySynth.addListener("noteon", e => {
    // e.note.number is a number from 0 - 127, representing full MIDI range
    var ascii_rep = String.fromCharCode(e.note.number)

    pattern_tracker.addNote(ascii_rep);
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

  // iterate through input sequence, find midi note name and number
  for (i = 0; i < input_sequence.length; i += 3) {
    var curr_note = ""
    if (input_sequence[i+1] == "n") {
      curr_note = input_sequence[i] + input_sequence[i+2]
    } else {
      curr_note = input_sequence.substring(i, i+3)
    }
    let midi_num = Utilities.guessNoteNumber(curr_note);
    var ascii_rep = String.fromCharCode(midi_num);
    var freq = Math.pow(2, (midi_num-69)/12)*440;
    oscillator.frequency.setTargetAtTime(freq, audioContext.currentTime, 0);

    pattern_tracker.addNote(ascii_rep);
    live_sequence = live_sequence.concat(curr_note);

    await timer(800);
  }
  audioContext.suspend()
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  stroke(255);
  strokeWeight(10);
  background(backgroundBlues[2]);

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

  // pattern rendering
  pattern_tracker = new PuddlePattern([], "");
}

function draw() {
  clear();

  background(backgroundBlues[2]);
  pattern_tracker.getNotes().forEach(function(note) {
    note.draw(); 
    note.update(backgroundBlues[2]);
  })
}

function randomVal(arr) {
  return(arr[int(random(arr.length))])
}
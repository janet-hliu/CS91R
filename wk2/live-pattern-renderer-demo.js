var time_interval = 40 //time between notes when testing

var midi_object = {track0: []}
var live_sequence = ""
var ascii_live_sequence = ""
var lookup = {}
var hist = {}; // match interval: (arc percentage, arc radius percentage)
var lastMatch;
// var r1;
// var r2;
var masterScale = 5;

var input;
var manualButton;
var liveButton;
var audioContext;
var oscillator;

// Returns a Promise that resolves after "ms" Milliseconds
const timer = ms => new Promise(res => setTimeout(res, ms))

function setup() {
  input = createInput("Cn3Dn3En3Gn5Gn5Cn3Dn3En3Cn3Dn3En3Gn5Gn5Cn3Dn3En3");
  input.position(20, 65);
  manualButton = createButton('submit');
  manualButton.position(input.x + input.width, 65);
  manualButton.mousePressed(updateSeq);
  liveButton = createButton('live');
  liveButton.position(manualButton.x  + manualButton.width, 65);
  // setup to enable WebMidi library: https://webmidijs.org/docs/
  liveButton.mousePressed(function() {
    WebMidi
    .enable()
    .then(onEnabled)
    .catch(err => alert(err));
  })

  midi2asciisequence(midi_object)

}

// Function to get or create an audio context
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

// Function triggered when WEBMIDI.js is ready
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

    ascii_live_sequence = ascii_live_sequence.concat(ascii_rep);
    live_sequence = live_sequence.concat(e.note.identifier);
    masterScale = 0
    // document.body.innerHTML+= `${e.note.identifier}, ${e.note.attack} <br>`;
    document.getElementById("live_sequence").innerHTML = live_sequence;
  })
}

//have a converter, then a player

//converts input to midi
function text2midi() {
  midi_object.track0 = [];
  let input_sequence = input.value()
  for (i = 0; i < input_sequence.length; i += 3) {
    var curr_note = ""
    if (input_sequence[i+1] == "n") {
      curr_note = input_sequence[i] + input_sequence[i+2]
    } else {
      curr_note = input_sequence.substring(i, i+3)
    }
    let midi_num = Utilities.guessNoteNumber(curr_note);
    midi_object.track0.push(midi_num);
    live_sequence = live_sequence.concat(curr_note);
  }
  //console.log(midi_sequence)
}

//converts midi to ascii sequence and plays
async function updateSeq() {

  if (midi_object.track0 != '') {
    midi_object.track0
  } else {
    text2midi();
  }

  masterScale = 0;
  getOrCreateContext()
  live_sequence = ""
  ascii_live_sequence = ""
  // iterate through input sequence, find midi note name and number
  for (i = 0; i < midi_object.track0.length; ++i) {

    var midi_num = midi_object.track0[i];
    var ascii_rep = String.fromCharCode(midi_num);
    var freq = Math.pow(2, (midi_num-69)/12)*440;
    oscillator.frequency.setTargetAtTime(freq, audioContext.currentTime, 0);
    ascii_live_sequence = ascii_live_sequence.concat(ascii_rep);
    await timer(time_interval);
  }
  audioContext.suspend()
}

function draw() {
  // put drawing code here
  var canvas = document.getElementById('output');
  // console.log(live_sequence)
  var renderer = new PatternRenderer(canvas, ascii_live_sequence);

  var newHist;
  var newLastMatch;
  // var newR1;
  // var newR2;
  [newHist, newLastMatch, masterScale] = renderer.render(6, hist, lastMatch, masterScale);
  //compare newHist and hist


  hist = newHist;
  lastMatch = newLastMatch;
  // r1 = newR1
  // r2 = newR2

  //console.log(hist);
  // console.log(lastMatch)
  //Cn3Dn3En3Gn5Gn5Cn3Dn3En3
  //Cn3Dn3En3Gn5Gn5Cn3Dn3En3Cn3Dn3En3Gn5Gn5Cn3Dn3En3
}
// make a datastructure to keep track of midi notes
var live_sequence = ""
var ascii_live_sequence = ""
var lookup = {}
var hist = {}; //interval to arc percentage
var lastMatch;

var input;
var manualButton;
var liveButton;
var audioContext;
var oscillator;

// Returns a Promise that resolves after "ms" Milliseconds
const timer = ms => new Promise(res => setTimeout(res, ms))

function setup() {
  input = createInput();
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
}

// Function to get or create an audio context
function getOrCreateContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
    oscillator = audioContext.createOscillator();
    oscillator.connect(audioContext.destination);
    oscillator.start();
    // audioContext.suspend();
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
    // console.log(ascii_live_sequence);
    // document.body.innerHTML+= `${e.note.identifier}, ${e.note.attack} <br>`;
    document.getElementById("live_sequence").innerHTML = live_sequence;
  })
}

async function updateSeq() {
  getOrCreateContext()
  live_sequence = ""
  ascii_live_sequence = ""
  let input_sequence = input.value()

  // iterate through input sequence, find midi note name and number
  for (i = 0; i < input_sequence.length; i += 3) {
    var curr_note = ""
    if (input_sequence[i+1] == "n") {
      curr_note = input_sequence[i] + input_sequence[i+2]
    } else {
      curr_note = input_sequence.substring(i, i+3)
    }
    console.log(curr_note);
    let midi_num = Utilities.guessNoteNumber(curr_note);
    var ascii_rep = String.fromCharCode(midi_num);
    var freq = Math.pow(2, (midi_num-69)/12)*440;
    oscillator.frequency.setTargetAtTime(freq, audioContext.currentTime, 0);

    ascii_live_sequence = ascii_live_sequence.concat(ascii_rep);
    live_sequence = live_sequence.concat(curr_note);

    await timer(400);
    console.log("suspending")
  }
  audioContext.suspend()
}

function draw() {
  // put drawing code here
  var canvas = document.getElementById('output');
  console.log(ascii_live_sequence);
  var renderer = new PatternRenderer(canvas, ascii_live_sequence);

  var newHist;
  var newLastMatch;
  [newHist, newLastMatch] = renderer.render(0, hist, lastMatch);
  //compare newHist and hist

  // if (typeof lastMatch !== 'undefined' && !newHist.hasOwnProperty(lastMatch)) {
  //   delete hist.lastMatch
  // }

  hist = newHist;
  lastMatch = newLastMatch;

  //console.log(hist);
  // console.log(lastMatch)
  //Cn3Dn3En3Gn5Gn5Cn3Dn3En3
}
// Cn3Dn3En3Gn5Gn5Cn3Dn3En3Cn3Dn3En3Gn5Gn5Cn3Dn3En3
// var backgroundBlues = ["#001219", "#001524", "#003049", "#335C67", "#15616D", "#293241"];
// var backgroundBlue = [0, 21, 36];
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
var transparentBackgroundCol;
var NOTE_DURATION = 40;

// returns a Promise that resolves after "ms" Milliseconds
// used for playing manual sequences
const timer = ms => new Promise(res => setTimeout(res, ms))

// variables needed to store pixel data for ripple effect
// https://www.youtube.com/watch?v=BZUdGqeOD0w
let col;
let row;
let current;
let previous;
let dampening = 0.99;
var rippleBuffer;
var pointBuffer;

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

    pattern_tracker.addNote(ascii_rep, row, col);
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

function setup() {
  pixelDensity(1);
  col = 600;
  row = 400;
  var cnv = createCanvas(windowWidth, windowHeight);
  // cnv.position(100, 100);
  rippleBuffer = createGraphics(col, row);
  pointBuffer = createGraphics(col, row);
  angleMode(DEGREES);
  stroke(255);
  strokeWeight(10);

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

  // initializing array data for ripples
  current = new Array(col).fill(0).map(n => new Array(row).fill(0));  // new Array(col).fill(backgroundBlue).map(n => new Array(row).fill(backgroundBlue));
  previous = new Array(col).fill(0).map(n => new Array(row).fill(0)); // new Array(col).fill(backgroundBlue).map(n => new Array(row).fill(backgroundBlue));

  // pattern rendering
  pattern_tracker = new PuddlePattern([], "");
  // transparentBackgroundCol = color(backgroundBlues[2]);
  // transparentBackgroundCol.setAlpha(5);
  rippleBuffer.background(0);
}

function mouseDragged() {
  previous[mouseX-100][mouseY-100] = 2500;
}

function draw() {
  pointBuffer.clear();
  rippleBuffer.loadPixels();
  for (let i = 1; i < col - 1; i++) {
    for (let j = 1; j < row - 1; j++) {
      current[i][j] =
        (previous[i - 1][j] +
          previous[i + 1][j] +
          previous[i][j - 1] +
          previous[i][j + 1]) /
          2 -
        current[i][j];
      current[i][j] = current[i][j] * dampening;
      // Unlike in Processing, the pixels array in p5.js has 4 entries
      // for each pixel, so we have to multiply the index by 4 and then
      // set the entries for each color component separately.
      let index = (i + j * col) * 4;
      rippleBuffer.pixels[index + 0] = current[i][j];
      rippleBuffer.pixels[index + 1] = current[i][j];
      rippleBuffer.pixels[index + 2] = current[i][j];
      // below is my try at color
      // current[i][j] =
      //   (previous[i-1][j].map((x, k) => x + previous[i+1][j][k])
                          // .map((x, k) => x + previous[i][j-1][k])
                          // .map((x, k) => x + previous[i][j+1][k])
                          // .map((x) => x/2)
                          // .map((x, k)=>x - current[i][j][k])
                          // .map((x) => x * dampening);
      // let index = (i + j * col) * 4;
      // pixels[index] = current[i][j][0];
      // pixels[index + 1] = current[i][j][1];
      // pixels[index + 2] = current[i][j][2];
    }
  }
  rippleBuffer.updatePixels();
  let temp = previous;
  previous = current;
  current = temp;

  pattern_tracker.getNotes().forEach(function(note) {
    note.draw(pointBuffer, 0);
    note.update(0);
    if (note.shouldDisplayRing()) {
      let pos = note.getPos();
      previous[int(pos.x)][int(pos.y)] = 2500;
    }
  })

  image(rippleBuffer, 100, 100);
  image(pointBuffer, 100, 100);
}
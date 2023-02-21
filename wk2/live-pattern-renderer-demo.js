// make a datastructure to keep track of midi notes
var live_sequence = ""
var ascii_live_sequence = ""
var lookup = {}

var input;
var manualButton;
var liveButton;

function setup() {

  input = createInput();
  input.position(20, 65);
  manualButton = createButton('submit');
  manualButton.position(input.x + input.width, 65);
  manualButton.mousePressed(updateSeq);
  liveButton = createButton('live');
  liveButton.position(manualButton.x  + manualButton.width, 65);
  liveButton.mousePressed(function() {
    WebMidi
    .enable()
    .then(onEnabled)
    .catch(err => alert(err));
  })

  // // setup to enable WebMidi library: https://webmidijs.org/docs/
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
    var ascii_rep = Stsr

    ascii_live_sequence = ascii_live_sequence.concat(ascii_rep);
    live_sequence = live_sequence.concat(e.note.identifier);
    // console.log(ascii_live_sequence);
    // document.body.innerHTML+= `${e.note.identifier}, ${e.note.attack} <br>`;
    document.getElementById("live_sequence").innerHTML = live_sequence;
  })
}

function updateSeq() {
  live_sequence = input.value()
  console.log(live_sequence)
  // document.getElementById("live_sequence").innerHTML = live_sequence;
  // for (i = 0; i < live_sequence.length; i += 3) {
    

  // }
}

function draw() {
  // put drawing code here
  var canvas = document.getElementById('output');
  console.log(ascii_live_sequence)
  var renderer = new PatternRenderer(canvas, ascii_live_sequence);
  renderer.render(0);
}
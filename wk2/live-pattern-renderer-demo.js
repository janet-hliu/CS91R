// make a datastructure to keep track of midi notes
var live_sequence = ""
var ascii_live_sequence = ""
var lookup = {}

function setup() {
  // setup to enable WebMidi library: https://webmidijs.org/docs/
  WebMidi
      .enable()
      .then(onEnabled)
      .catch(err => alert(err));
  
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
}

function draw() {
  // put drawing code here
  var canvas = document.getElementById('output');
  console.log(ascii_live_sequence)
  var renderer = new PatternRenderer(canvas, ascii_live_sequence);
  renderer.render(0);
}
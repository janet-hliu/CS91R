// make a datastructure to keep track of midi notes
var live_sequence = ""

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
        var subsequence = e.note.identifier;
        if (subsequence.length == 2) {
          subsequence = subsequence[0] + 'n' + subsequence[1]
        }

        live_sequence = live_sequence.concat(subsequence);
        console.log(e.note.identifier);
        console.log(live_sequence);
        // document.body.innerHTML+= `${e.note.identifier}, ${e.note.attack} <br>`;
        document.getElementById("live_sequence").innerHTML = live_sequence;
      })
    }
}

function draw() {
  // put drawing code here
  var sequence = document.getElementById('live_sequence').textContent;
  var canvas = document.getElementById('output');
  var renderer = new PatternRenderer(canvas, sequence);
  renderer.render(0);
}
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
  
      const mySynth = WebMidi.inputs[0];

      // jeff's piano shows all info coming from channel 16: display e.message.channel
      mySynth.addListener("noteon", e => {
        // console.log(e.note.identifier);
        document.body.innerHTML+= `${e.note.identifier} <br>`;
      })
    }
}

function draw() {
  // put drawing code here
}

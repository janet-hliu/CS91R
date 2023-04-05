var midiCatalog = [
  'koya2.mid', 'furelise.midi','988-v04.midi'
];

function renderTrack(track) {
  i = 0;
	var sequence = [];
	track.forEach(function(t) {
		if (t.noteNumber && t.subtype == 'noteOn') {
			sequence.push(t.noteNumber);
		}
	});
  return(sequence);   
}

function render(song) {
    return(renderTrack(song.tracks[1])); // what track to do??
}

//midi file to topline sequence
function renderMidiTracks() {
  for (let i = 0; i < midiCatalog.length; i++) {
    let button = createButton(midiCatalog[i]);
    button.className = midiCatalog[i]
    button.position(input.x + i * 100, input.y+input.height);
    button.mousePressed(function() {
      input.value(button.className);
      url = '../wk2/midi/' + midiCatalog[i];
    });
  }
}
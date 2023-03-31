var seq = ''

function renderTrack(track) {
	//console.log('track', i, track);
    i = 0;
	var sequence = [];
	track.forEach(function(t) {
		if (t.noteNumber && t.subtype == 'noteOn') {
			sequence.push(t.noteNumber);
		}
	});
    seq = sequence;
}

function render(song) {
    print(song.tracks)
    renderTrack(song.tracks[1]); //what track to do??
}

var midiCatalog = [
    'koya2.mid', 'furelise.midi','988-v04.midi'
];

//midi file to topline sequence
function midi2asciisequence(midi_object) {

    midiCatalog.forEach(function(url) {
		var link = document.createElement('a');
		link.innerHTML = url;
		link.onclick = function() {
			display(url);
            midi_object.track0 = WTF;
		}
		document.getElementById('links').appendChild(link);
	});
	function display(url) {
		url = 'midi/' + url;

		document.getElementById('midi-display').innerHTML = url + '  ';
	    readMidi(url, function(song) {
		    render(song);
		});
	}
}
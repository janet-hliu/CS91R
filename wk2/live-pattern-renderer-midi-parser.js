var WTF = ''

function renderTrack(track) {
	//console.log('track', i, track);
    i = 0;
	var sequence = [];
	track.forEach(function(t) {
		if (t.noteNumber && t.subtype == 'noteOn') {
			sequence.push(t.noteNumber);
		}
	});
	// if (sequence.length < 6) {
	// 	return;
	// }
	// var steps = [];
	// for (var i = 1; i < sequence.length; i++) {
	// 	steps[i - 1] = sequence[i] - sequence[i - 1];
	// }
    WTF = sequence;
    //return sequence;
}

function render(song) {
	// document.getElementById('canvases').innerHTML = '';
    //print(typeof song.tracks)
    renderTrack(song.tracks[0]); //what track to do??
    //return sequence;
}

var midiCatalog = [
    'koya1.mid', 'koya2.mid', 'koya3.mid',
    'minute_waltz.mid', 'rachmaninov3.mid', 'furelise.midi',
    'ABBA_-_Dancing_Queen.mid', 'Mariah_Carey_-_Hero.mid',
    'Pink_Floyd_-_Another_Brick_in_the_Wall.midi',
    'Ahfat03.MID', 'simpsons.mid', '988-v01.midi', '988-v02.midi',
    '988-v03.midi', '988-v04.midi'
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
	//display(midiCatalog[3]);
}
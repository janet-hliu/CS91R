

function renderTrack(track, i) {
	//console.log('track', i, track);
	var sequence = [];
	track.forEach(function(t) {
		if (t.noteNumber && t.subtype == 'noteOn') {
			sequence.push(t.noteNumber);
		}
	});
	if (sequence.length < 6) {
		return;
	}
	var steps = [];
	for (var i = 1; i < sequence.length; i++) {
		steps[i - 1] = sequence[i] - sequence[i - 1];
	}
	PatternRenderer.makeDisplay(
			document.getElementById('canvases'), 200, steps, 2, sequence);

}

function render(song) {
	document.getElementById('canvases').innerHTML = '';
	song.tracks.forEach(renderTrack);
}

var midiCatalog = [
   'koya1.mid', 'koya2.mid', 'koya3.mid',
   'minute_waltz.mid', 'rachmaninov3.mid', 'furelise.midi',
   'ABBA_-_Dancing_Queen.mid', 'Mariah_Carey_-_Hero.mid',
   'Pink_Floyd_-_Another_Brick_in_the_Wall.midi',
   'Ahfat03.MID', 'simpsons.mid', '988-v01.midi', '988-v02.midi',
   '988-v03.midi', '988-v04.midi'
];

function demo() {
	midiCatalog.forEach(function(url) {
		var link = document.createElement('a');
		link.innerHTML = url;
		link.onclick = function() {
			display(url);
		}
		document.getElementById('links').appendChild(link);
	});
	function display(url) {
		url = '../midi/' + url;

		document.getElementById('midi-display').innerHTML = url + ' ';
	  readMidi(url, function(song) {
			render(song);
		});
	}
	display(midiCatalog[3]);
}


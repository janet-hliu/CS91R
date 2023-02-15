
function demo() {
	console.log('reading midi');
	readMidi('../midi/minute_waltz.mid', function(song) {
		console.log(song);
	});
}
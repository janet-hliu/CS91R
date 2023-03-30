class PuddlePattern{
	constructor(notes, sequence, minPatternLength) {
		this.notes = notes;
		this.seq = sequence;
		this.minPatternLength = 3;
	}

	// updates this.notes, called when sequence changes
	update() {
		var patternFinder = new PatternFinder(this.seq, this.minPatternLength);
		var len = this.seq.length;
		console.log(this.seq);
	
		while (null != (match = patternFinder.nextMatch())) {
			console.log(this.seq.substring(match[0].start, match[0].finish+1)+ ": " + match[0].start.toString() +" to " +match[0].finish.toString() + " matched with " + match[1].start.toString() + " to " + match[1].finish.toString());
		}
	}

	addNote(next) {
		this.seq = this.seq.concat(next);
		var initY = random(height);
	
		var goalX = max(random(3, 40), randomGaussian(0.35*width, 0.15*width));
		var goalY = random(10, height-10);
	
		var col = randomVal(lumens);
		append(this.notes, new Note(10, col, width + 20, initY, goalX, goalY));
		this.update();
	}
	
	clear() {
		this.notes = [];
		this.seq = "";
	}
	
	getSeq() {
		return this.seq;
	}

	getNotes() {
		return this.notes;
	}
}
class PuddlePattern{
	constructor(notes, sequence, minPatternLength) {
		this.notes = notes;
		this.seq = sequence;
		this.minPatternLength = 5;
	}

	// updates this.notes, called when sequence changes
	update() {
		var patternFinder = new PatternFinder(this.seq, this.minPatternLength);
		console.log(this.seq);
	
		while (null != (match = patternFinder.nextMatch())) {
			var i1 = match[0].start; 
			var j1 = match[1].start; 
			var j2 = match[1].finish;
			var newGoal = this.notes[i1].ogGoalPos;
			for (let j = j1; j <= j2; j++) {
				this.notes[j].setGoalPos(newGoal);
				this.notes[j].addRing(1, 0, 30);
			}
			console.log(this.seq.substring(match[0].start, match[0].finish+1)+ ": " + match[0].start.toString() +" to " +match[0].finish.toString() + " matched with " + match[1].start.toString() + " to " + match[1].finish.toString());
		}
	}

	addNote(next, canvasH, canvasW) {
		this.seq = this.seq.concat(next);
		var initY = random(canvasH);
	
		var goalX = max(random(3, 40), randomGaussian(0.35*canvasW, 0.15*canvasW));
		var goalY = random(10, canvasH-10);
		var col = 255; // lumens[0];
		append(this.notes, new Note(10, col, canvasW, initY, goalX, goalY, next));
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
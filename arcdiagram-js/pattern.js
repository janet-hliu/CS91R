class Pattern {
	constructor(notes, sequence, width, height, minPatternLength) {
		// [note1x, note1y, note2x, note2y, ...]
		// index i's x location is at: 2*x
		// index i's y location is at: 2x+1
		this.notes = notes;
		// ["start_interval1x,start_int1y,end_int1x,end_int1y,start_int2x,start_int2y,end_int2x,end_int2y": progress];
		this.arcs = [];

		this.num_notes = sequence.length;
		this.num_arcs = 0;
		// string of ascii representations
		this.seq = sequence;

		// canvas width + height
		// console.log(width); // 1136
		// console.log(height) // 1016
		this.width = width;
		this.height = height;
		this.minPatternLength = 2;
		this.s = Math.min(width, 2 * height);
		this.actual_scale = 1;
		// y position for the render
		this.baseH = this.height * 0.25;
	}

	// updates this.notes, called when sequence changes
	updateNotes() {
		for (var i = 0; i < this.num_notes; i++) {
			var [x, y] = this.findLocation(i);
			this.notes[2*i]= x;
			this.notes[2*i+1]= y;
		}
		var patternFinder = new PatternFinder(this.seq, this.minPatternLength);
		old_arcs = this.arcs;
		this.arcs = [];
		this.num_arcs = 0;
	
		while (null != (match = patternFinder.nextMatch())) {
			var i1 = match[0].start; 
			var i2 = match[0].finish;
			var j1 = match[1].start; 
			var j2 = match[1].finish;
			// [start_interval1x, start_int1y, end_int2x, end_int2y, end_int1x, end_int1y, start_int2x, start_int2y]
			// , percentage];

			this.num_arcs += 1;
			
			this.arcs.push(
				this.notes[2*i1],this.notes[2*i1+1],
				this.notes[2*j2], this.notes[2*j2+1], 
				this.notes[2*i2], this.notes[2*i2+1],
				this.notes[2*j1], this.notes[2*j1+1]);
			
			//console.log(this.seq.substring(i1, i2+1)+ ": " + i1.toString() +" to " + i2.toString() + " matched with " + j1.toString() + " to " + j2.toString());
		}
	}

	// updates the percentage of the arc drawn
	updateArcs() {
		for (var i=8; i < this.arcs.length; i+=9) {
			this.arcs[i] = max(1.0, this.arcs[i] + 0.05);
		}
	}

	addNote(next) {
		this.seq = this.seq.concat(next);
		this.num_notes += 1;
		this.notes.push(0);
		this.notes.push(0);
		this.updateNotes();
	}

	findLocation(index) {
		var x = this.s * index / this.actual_scale;
		return [x, this.baseH];
	}
	
	clear() {
		this.notes = [];
		this.seq = "";
	}
	
	getSeq() {
		return this.seq;
	}

	getNotes() {
		if (this.actual_scale < this.num_notes) {
			this.actual_scale = lerp(this.actual_scale, this.num_notes, 0.5);
			this.updateNotes();
		}
		return this.notes;
	}

	getArcs() {
		this.updateArcs();
		return this.arcs;
	}

	getNumNotes() {
		return this.num_notes;
	}

	getNumArcs() {
		return this.num_arcs;
	}
}
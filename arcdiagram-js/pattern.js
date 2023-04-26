class Pattern {
	constructor(notes, sequence, width, height, minPatternLength) {
		// [note1x, note1y, note2x, note2y, ...]
		// index i's x location is at: 2*i
		// index i's y location is at: 2i+1
		this.notes = notes;
		// ["start_int1_index,end_int1_index,start_int2_index,end_int2_index": progress];
		this.arcs = {};

		this.num_notes = sequence.length;
		this.num_arcs = 0;
		// string of ascii representations
		this.seq = sequence;

		// canvas width + height
		this.width = width;
		this.height = height;
		this.minPatternLength = 2;
		this.s = Math.min(width, 2 * height);
		this.actual_scale = 1;
		// y position for the render
		this.baseH = this.height * 0.25;
		this.lastMatch;
	}

	// updates this.notes's locations
	updateNotes() {
		for (var i = 0; i < this.num_notes; i++) {
			var [x, y] = this.findLocation(i);
			this.notes[2*i]= x;
			this.notes[2*i+1]= y;
		}
	}

	findArcs() {
		var patternFinder = new PatternFinder(this.seq, this.minPatternLength);
		let old_arcs = structuredClone(this.arcs);
		this.arcs = {};
		this.num_arcs = 0;
	
		var newLastMatch;
		while (null != (match = patternFinder.nextMatch())) {
			if (typeof newLastMatch != 'undefined') {
				if (match[1].finish >= newLastMatch[1].finish) {
					newLastMatch = match;
				}
			} else {
				newLastMatch = match;
			}
	
			var i1 = match[0].start; 
			var i2 = match[0].finish;
			var j1 = match[1].start; 
			var j2 = match[1].finish;
			let key = str(i1) + "," + str(i2) + "," + str(j1) + "," + str(j2)

			if (key in old_arcs) {
				this.arcs[key] = min(old_arcs[key] + 0.02, 1.0);
			} else if (typeof this.lastMatch !== 'undefined' && 
					match[0].start == this.lastMatch[0].start && 
					match[1].start == this.lastMatch[1].start) { // if both start intervals are the same
				this.arc[key] = min(old_arcs[key] + 0.02, 1.0);
				hist[this.lastMatch] + 2;
			} else {
				this.arcs[key] = 0.0;
			}

			this.num_arcs += 1;
			
			// console.log(this.seq.substring(i1, i2+1)+ ": " + i1.toString() +" to " + i2.toString() + " matched with " + j1.toString() + " to " + j2.toString());
		}
	}

	// updates the percentage of the arc drawn
	updateArcs() {
		for (key in this.arcs) {
			this.arcs[key] = min(1.0, this.arcs[key] + 0.02);
		}
	}

	addNote(next) {
		this.seq = this.seq.concat(next);
		this.num_notes += 1;
		this.notes.push(0);
		this.notes.push(0);
		this.updateNotes();
		this.findArcs();
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
		// converting string keys of dictionary to array of form
		// [start_interval1x,start_int1y,end_int1x,end_int1y,start_int2x,start_int2y,end_int2x,end_int2y]
		var raw_arcs = [];
		var arc_progress = [];
		Object.entries(this.arcs).forEach(([key, value]) => {
			let [i1, i2, j1, j2] = key.split(",");

			raw_arcs.push(
				this.notes[2*i1],this.notes[2*i1+1],
				this.notes[2*j2], this.notes[2*j2+1], 
				this.notes[2*i2], this.notes[2*i2+1],
				this.notes[2*j1], this.notes[2*j1+1]);
			arc_progress.push(value);
		 });
		return [raw_arcs, arc_progress];
	}

	getNumNotes() {
		return this.num_notes;
	}

	getNumArcs() {
		return this.num_arcs;
	}
}
/**
This class represents an interval in a sequence that contains
a sequentially repeated pattern. For example in the sequence abc10101010xyz
the interval that goes 10101010 is an interval with the pattern "10"
repeated four times. In this sequence, "10" is the "fundamental pattern."
The length of the fundamental pattern is the "period" and each occurrence
of the fundamental pattern is a "tile."
*/

var SequentialPattern = function(sequence, start, finish, period) {
	this.sequence = sequence;
	this.start = start;
	this.finish = finish;
	this.period = period;
};

SequentialPattern.prototype.toString = function() {
	var reps = (this.finish - this.start + 1) / this.period;
	return this.sequence.slice(this.start,
			this.start + this.period) + ' x ' + reps; 
};

// TODO: refactor to subclass Interval, as in old Java version.
SequentialPattern.prototype.intersectsInterval = function(sp) {
  return !(this.finish < sp.start || this.start > sp.finish);
};
SequentialPattern.prototype.intersectsBounds = function(start, finish) {
  return !(this.finish < start || this.start > finish);
};

SequentialPattern.prototype.containsBounds = function(start, finish) {
  return start >= this.start && finish <= this.finish;
};


SequentialPattern.prototype.getLength = function() {
  return this.finish - this.start + 1;
};

/**
Whether the given interval is a tile of this SequentialPattern.

@param interval an interval to be tested.
@return true if the interval is a tile; otherwise false.
*/
SequentialPattern.prototype.isTile = function(interval) {
    return this.start <= interval.start &&
    		   this.finish >= interval.finish &&
           (interval.start - this.start) % this.period == 0 &&
           interval.getLength() == this.period;
}

SequentialPattern.prototype.tileNum = function(p) {
	return Math.floor((p - this.start) / this.period);
};

/**
Whether the given intervals fall in the same tile.

@param interval1 first interval to be tested.
@param interval2 first interval to be tested.
@return whether the given intervals fall in the same tile.
*/
// NOTE: THE LOGIC HERE HAS BEEN MODIFIED FROM JAVA VERSION,
// HOPEFULLY FIXING A BUG!
SequentialPattern.prototype.sameTile = function(interval1, interval2) {
  var s1 = this.tileNum(interval1.start);
  var f1 = this.tileNum(interval1.finish);
  var s2 = this.tileNum(interval2.start);
  var f2 = this.tileNum(interval2.finish);
  return s1 == f1 && f1 == s2 && s2 == f2;
}
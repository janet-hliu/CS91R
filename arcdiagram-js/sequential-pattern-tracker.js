
/**
Tracks all SequentialPatterns that exist in a sequence.

Example: 123123123 has a "sequential pattern", but
123ab123cd123" does *not* have a sequential pattern,
since the "123"s are interrupted by other things.
These patterns form an important special case, and we
need special logic to detect them. Most importantly, we
ultimately want a pattern like 1111 to be parsed as
four "1"s in a row, not (say) two "11"s or even two overlapping
"111"s.
*/

/** 
Create a new SequentialPatternTracker for the given sequence and with
the given pattern tree.

@param sequence the base sequence for this RepetitionTracker.
@param root the root of the precomputed pattern tree for this sequence.
*/
var SequentialPatternTracker = function(sequence, root) {
	this.sequence = sequence;
	this.root = root;
	this.regionArray = [];
	this.findRepetitions(root);
};

/**
Get an array of all SequentialPatterns starting at the given point
in this sequence.

@param startPosition position of pattern requested.
@return an array containing all SequentialPatterns with the given
        starting position.
*/
SequentialPatternTracker.prototype.
    getRepeatedPatternIntervals = function(startPosition) {
      return this.regionArray[startPosition];
};

/**
Find all SequentialPatterns for this sequence, given the
precomputed pattern tree.

@param patternTree the precomputed pattern node.
*/
SequentialPatternTracker.prototype.findRepetitions = function(node) {
  for (var i = 0; i < this.sequence.length; i++) {
  	this.regionArray[i] = [];
  }
	var patternList = new BreadthFirstList(node);
    
  // Go through all possible patterns and see if any are repeated.
  while (patternList.hasNext()) {
    this.test(patternList.next());
  }
};
    
/**
Test a given pattern for presence in a RepeatedPatternInterval.

@param node given PatternNode to test.
*/
SequentialPatternTracker.prototype.test = function(node) {
  var n = node.countStartPositions();
  if (n < 2) return;
  var length = node.getLength();
  // look for exact repetitions, signaling that
  // this is a "tile"
  for (var i = 0; i < n - 1; i++) {
    if (node.getPatternStartPosition(i + 1) -
        node.getPatternStartPosition(i) == length) {
        this.tryNewRegion(node.getPatternStartPosition(i),length);
    }
  }
};
    
/**
Try a new region to see if it is part of a hitherto unknown
RepeatedPatternInterval. If it is, put it into the array
of RepeatedPatternInterval regions.
*/
SequentialPatternTracker.prototype.tryNewRegion =
    function(start, period) {
  var currentRegions = this.regionArray[start];
  var k = currentRegions.length;
  
  // If this is part of a known repetition region, return.
  for (var i = 0; i < k; i++) {
    var r = currentRegions[i];
    if (r.period == period && r.containsBounds(start, start + period)) {
    	return;
    }  
  }
  
  // OK, we have a new repetition region.
  // see how far to the left it extends:
  while (start > 0 &&
  		this.sequence[start - 1] == this.sequence[start -1 + period]) {
    start--;
  }
      
  // See how far to the right it goes:
  var finish = start + period;
  while (finish < this.sequence.length-1 && 
  		this.sequence[finish + 1] ==
  		this.sequence[finish + 1 - period]) {
         finish++;
  }
         
  // Make length be multiple of period:
  finish = start + period * ~~((finish - start + 1) / period) - 1;
  
  // Make new sequential pattern object:
  var region = new SequentialPattern(
  		this.sequence, start, finish, period);
      
  // Register this region:
  for (i = start; i <= finish; i++) {
    this.regionArray[i].push(region);
  }
}

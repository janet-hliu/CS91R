/**
A PatternFinder is designed to find and manage the pairs
of patterns that need to be visualized by an arc diagram.

The main reason for this class is that not all patterns detected
in a PatternNode will actually be interesting in practice,
so we need to filter many of them out--and this class takes care of that.
As a bonus, we include logic for iterating easily through
relevant patterns without needing to know the internals of
the suffix tree structure used in PatternNode.

To use a PatternTracker, construct it with an array or string
and (optionally) a minimal length of pattern to track.

You then can iterate through the pairs of relevant patterns by
calling the nextMatch method.

To reset the iterator back to the beginning, call reset().
*/
var PatternFinder = function(sequence, minPatternLength) {
	this.sequence = sequence;
	this.minPatternLength = minPatternLength || 2;
  this.patternTreeRoot = PatternNode.makeTree(sequence);
  this.repetitions = new SequentialPatternTracker(
  		sequence, this.patternTreeRoot);
  this.reset();
};

/**
Reset the pattern iterator to the first pair of matching patterns.
*/
PatternFinder.prototype.reset = function() {
  this.patterns = new BreadthFirstList(this.patternTreeRoot);
  this.currentPosition = 0;
  this.currentNode = null;
};

/**
Provide the next pair of matching patterns in the iterations.
The pair is returned as an array with two elements. The method returns
null if there are no more matches.

@return a 2-element array of Intervals, or null if no more matches.
*/
PatternFinder.prototype.nextMatch = function() {
  for (;;) {
    while (this.currentNode == null || this.currentNode.getLength() == 0 ||
        this.currentPosition > this.currentNode.countStartPositions() - 2)
    {
      this.currentNode = this.patterns.next();
      if (this.currentNode == null) {
      	return null;
      }
      this.currentPosition=0;
    }
    var length = this.currentNode.getLength();
    var start1 = this.currentNode.getPatternStartPosition(
    		this.currentPosition);
    var start2 = this.currentNode.getPatternStartPosition(
    		++this.currentPosition);
    var sequence = this.sequence;
    function seq(s) {
    	return sequence.substring(s, s+ length);
    }
    var connect = this.shouldConnect(
        this.currentNode, start1, start2, length);
    //console.log(connect + ':   ' + seq(start1) + ' @ ' + start1 +
    //		'  &  ' + seq(start2) + ' @ ' + start2);

    if (connect) {
      return [Interval.startAndLength(start1, length),
              Interval.startAndLength(start2, length)];
    }
  }
  // If we get here, are we in an infinite loop?
  // TODO: Check this never happens!!!
};

/**
 * Decide whether we should connect the given pattern
 * occurring at the two given positions and having the given
 * length.
 *
 * @param pattern the given pattern.
 * @param start1 the start position of the first occurrence.
 * @param start2 the start position of the second occurrence.
 * @param length the length of the pattern.
 * @return Whether these two patterns should be connected in a matching diagram.
 *
 * <P>
 * Here are the criteria used to determine if we return
 * a given pattern in the pattern tree:
 * The pattern is represented by a node in the pattern tree.
 * We connect them if
 *       1. they are fundamental patterns for a rep. region
 *    or:
 *       2. they are in same fund. pattern for any rep. region
 *          that contains them.
 *   or 3. they are not both in the same repetition region,
 *          and not both non-maximal bits of rep. regions of
 *          same period.
 */
PatternFinder.prototype.shouldConnect =
    function(pattern, start1, start2, length) {
  var interval1 = Interval.startAndLength(start1, length);
  var interval2 = Interval.startAndLength(start2, length);
  var regions = this.repetitions.getRepeatedPatternIntervals(start1);
  var n = regions.length;
  var regions2 = this.repetitions.getRepeatedPatternIntervals(start2);
  var m = regions2.length;

  // Check repetition region criteria.
  for (var i = 0; i < n; i++) {
    var r = regions[i];
    //console.log('     r: ', r);
    //console.log('     interval2: ', interval2);
    //console.log('     r.contains(interval2): ', r.contains(interval2));
    // I think next thing assumes interval1 occurs before interval2?
    if (!r.containsBounds(interval2.start, interval2.finish)) {
      if (r.intersectsBounds(interval2.start, interval2.finish)) {
      	//console.log('     failed intersection criterion');
      	//console.log('     ', r, interval2);
        return false;
      }
      continue;
    }
    if (r.isTile(interval1) && r.isTile(interval2)) {
      return r.getLength() >= this.minPatternLength;
    }
    if (!r.sameTile(interval1, interval2)) {
      return false;
    }
  }
  //console.log('     met rep region criterion');

  // Make sure long enough to report
  if (length < this.minPatternLength) {
  	return false;
  }
  //console.log('     met min pattern length');

  // Check maximality conditions.
  // One is automatic: right/left
  // because of the way the pattern tree is constructed

  // Make sure pattern is left/left-maximal
  // i.e. both patterns don't continue to left.
  var continuesToLeft = start1 > 0 &&
  		this.sequence[start1 - 1] == this.sequence[start2 - 1];
  if (continuesToLeft) {
  	return false;
  }
  //console.log('     met left/left');
 

  // Make sure pattern is "right/right-maximal"
  // i.e. both patterns don't continue to right.
  var right1 = this.sequence[start1 + length];
  var right2 = this.sequence[start2 + length];
  var continuesToRight = (start1 + length < this.sequence.length) &&
      start2 + length < this.sequence.length && right1 == right2;
  if (continuesToRight) {
  	return false;
  }
  //console.log('     met right/right: ' + right1 + ' != ' + right2);

  // Make sure pattern is "left/right-maximal"
  // i.e. does any descendant contain both a start at start2,
  // and an end at start1+length-1?

  // Loop through all descendants:
  while (pattern != null && start2 + length < this.sequence.length) {
    pattern = pattern.getExtension(this.sequence[start2 + length]);
    start2++; start1--;
    if (pattern != null && pattern.hasStart(start1)) {
    	return false;
    }
  }

  // All is OK. Return true.
  return true;
}
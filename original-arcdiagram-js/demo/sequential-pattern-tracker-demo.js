
function demo() {
	function trackSequencePatterns(s) {
		var p = PatternNode.makeTree(s);
		console.log('> ', s);
		//p.printPatterns();
		var tracker = new SequentialPatternTracker(s, p);
    tracker.regionArray.forEach(function(region, i) {
    	region.forEach(function(r) {
    		console.log(i, s[i], r.toString(), r.start, r.finish, r.period);
    	});
    });
		console.log('\n\n');
	}
	// seem ok
	trackSequencePatterns('abcabc1212312');
  trackSequencePatterns('123123');
  trackSequencePatterns('0000ababab12312');
  trackSequencePatterns('a1212312323b');
  trackSequencePatterns('1111');
  trackSequencePatterns('101010');
  trackSequencePatterns('0101010');
  trackSequencePatterns('abc123abc456abc');
  trackSequencePatterns('abc123123def');
  trackSequencePatterns('abc123123abc123');
  trackSequencePatterns('abc123123abc');
  trackSequencePatterns('abc123123a');
}
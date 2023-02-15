
function demo() {
	function subsequence(seq, interval) {
		return seq.slice(interval.start, interval.finish + 1) +
		    '  @  ' + interval.start;
	}
	function printPatterns(s) {
		//s = s.split('');
		console.log('> ', s);
  	var p = new PatternFinder(s, 5);
  	var match;
		while (null != (match = p.nextMatch())) {
			console.log('   ' + subsequence(s, match[0]) + '   ,   ' +
					subsequence(s, match[1]));
		}
		console.log('\n\n');
	}
	printPatterns('ab1_ab2.ab2 ab1');
/*
  printPatterns('abcdab');
  printPatterns('a1a2');
  printPatterns('aaaaa');
  printPatterns('abcX123YabcZ123Q');
  printPatterns('101010');
  printPatterns('1010101');
  printPatterns('ab12ab12ab12ab');
  printPatterns('abcde12345abcde');
  printPatterns('abc123abc456abc');
  printPatterns('a123123b');
  printPatterns('a123123b');
  printPatterns('123123a');
  printPatterns('123123');
  printPatterns('0101');
    */
  //printPatterns(document.getElementById('poem1').textContent);

}
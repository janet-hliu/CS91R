
function demo() {
	function printPatterns(s) {
		console.log('> ', s);
  	var p = PatternNode.makeTree(s);
		p.printPatterns();	
		console.log('\n\n');
	}

  printPatterns('abcdab');
  printPatterns('101010');
  printPatterns('abcde12345abcde');
  printPatterns('abc123abc456abc');
  printPatterns('a123123b');
  printPatterns('a123123b');
  printPatterns('123123a');
  printPatterns('123123');
  printPatterns('0101');
}

function demo() {

	function printList(s) {
		var p = PatternNode.makeTree(s);
		console.log('> ', s);
		var list = new BreadthFirstList(p);
		while (list.hasNext()) {
			var node = list.next();
			console.log(node.getPattern(), node.hasChildren());
		}
		console.log('\n\n');
	}
	
	printList('abcdab');
	printList('101010');
	printList('abcde12345abcde');
	printList('abc123abc456abc');

}
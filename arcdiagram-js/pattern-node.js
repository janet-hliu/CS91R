var PatternNode = function(sequence, symbol) {
	this.sequence = sequence;
	this.symbol = symbol; //ask martin: what is symbol?
	this.parent = null;
	this.children = [];
	this.startPositions = [];
	this.extensionTable = {};
	this.depth = 0;
	this.patternContinues = false;
};

PatternNode.SEQUENCE_START = '<sequence start>';
PatternNode.SEQUENCE_END = '<sequence end>';
PatternNode.PATTERN_START = '<pattern start>';

PatternNode.makeTree = function(sequence) {
	var root = new PatternNode(sequence, PatternNode.PATTERN_START);
	for (var i = 0; i < sequence.length; i += 3) {
		root.addPatternStartPosition(i);
	}
	root.extend();
	return root;
};

PatternNode.prototype.hasChildren = function() {
	return this.children.length > 0;
};

PatternNode.prototype.addChild = function(child) {
	this.children.push(child);
	child.parent = this;
	child.depth = this.depth + 1;
};

PatternNode.prototype.getLength = function() {
	return this.depth;
};

PatternNode.prototype.hasStart = function(start) {
  var n = this.countStartPositions();
  for (var i = 0; i < n; i++) {
    if (start == this.getPatternStartPosition(i)) {
      return true;
    }
  }
  return false;
};

PatternNode.prototype.getExtension = function(symbol) {
  return this.extensionTable[symbol];
};

PatternNode.prototype.getPattern = function() {
  if (this.symbol == PatternNode.SEQUENCE_START ||
  		this.symbol == null || this.parent == null) {
  	return '';
  }
  return this.parent.getPattern() + this.symbol;
};

PatternNode.prototype.printPatterns = function (indent) {
	indent = indent || '';
  console.log(indent, this.getPattern());
  this.children.forEach(function(c) {c.printPatterns(indent + '  ')});
};

PatternNode.prototype.toString = function() {
  var s = this.getPattern();
  for (var i = 0; i < this.countStartPositions(); i++) {
    s += ", " + this.getPatternStartPosition(i);
  }
  return s;
};

PatternNode.prototype.addPatternStartPosition = function(start) {
  this.startPositions.push(start);
};

PatternNode.prototype.getPatternStartPosition = function(n) {
  return this.startPositions[n];
};

PatternNode.prototype.countStartPositions = function() {
  return this.startPositions.length;
};

PatternNode.prototype.item = function(i) {
  if (i < 0) return PatternNode.SEQUENCE_START;
  if (i >= this.sequence.length) return PatternNode.SEQUENCE_END;
  return this.sequence[i];
};

PatternNode.prototype.extend = function() {
  var n = this.countStartPositions();
  console.log(n)
  var length = this.getLength();

  // Make sure there's more than one pattern:
  if (n < 2) {
  	//console.log(indent, 'n too small!', n);
  	return false;
  }

  // Check if all patterns have same predecessor.
  // If so, we've already tracked any repetitions in the pattern nodes.
  var predecessor = this.item(this.getPatternStartPosition(0) - 1);
  var identical = true;
  for (var i = 1; i < n; i++) {
  	// CHANGE FROM ORIGINAL LOGIC, HOPEFULLY FIXING BUG!
  	var current = this.item(this.getPatternStartPosition(i) - 1);
    if (current != predecessor) {
      identical = false;
      break;
    }
    predecessor = current;
  }
  if (identical) {
  	return false;
  }


  // Create a child node for every possible continuation,
  // and add these nodes as children.
  this.extensionTable = {};
  for (i = 0; i < n; i++) {
    var start = this.getPatternStartPosition(i);
    var nextPosition = start + length;
    var nextSymbol = this.item(nextPosition);
    var node = this.extensionTable[nextSymbol];
    if (node == null) {
      node = new PatternNode(this.sequence, nextSymbol);
      this.addChild(node);
      this.extensionTable[nextSymbol] = node;
    }
    node.addPatternStartPosition(start);
  }

  // Extend each child.
  var n = this.children.length;
  for (i = 0; i < n; i++) {
  	//console.log(indent, 'child', i);
    if (this.children[i].extend()) {
    	this.patternContinues = true;
    }
  }
  return true;
}

/**
This class enumerates the nodes of a tree of PatternNode objects
in a breadth-first order. Create a BreadthFirstList by passing the
root PatternNode to the constructor, and then you can ask for the
Nodes one by one using either nextElement() or nextNode().
*/

/**
Create a new BreadthFirstList for the TreeNodes with the given node as root.

@param the root of the tree.
*/
var BreadthFirstList = function(root) {
	this.currentGeneration = [root];
	this.nextGeneration = [];
}

/**
Say whether there are more elements in the list.

@return true if there are more elements, false otherwise.
*/
BreadthFirstList.prototype.hasNext = function() {
  return this.currentGeneration.length || this.nextGeneration.length;
};

/**
Return the next node in the list.

@return the next Node in the list.
*/
BreadthFirstList.prototype.next = function() {
  // If we've exhausted the elements in the current generation,
  // then move on to the next.
  if (!this.currentGeneration.length) {
      if (!this.nextGeneration.length) {
      	return null;
      }
      this.currentGeneration = this.nextGeneration;
      this.nextGeneration = [];
  }

  // Find next node in the current generation.
  var node = this.currentGeneration.pop();

  // Put its descendants into the next-generation list.
  for (var i = 0; i < node.children.length; i++) {
    this.nextGeneration.push(node.children[i]);
  }

  // return it.
  return node;
};
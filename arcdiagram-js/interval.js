

/**
Class representing an interval of integers, for instance (3,4,5,6,7).
You can create an Interval object by passing the start and finish
number to the constructor or by using the static method startAndLength. So
the interval from 3 to 7 could be created either by:

var myInterval = new Interval(3, 7);
or
var myInterval = Interval.startAndLength(3, 5);

The class contains methods for doing simple containment
and intersection operations.
*/

var Interval = function(start, finish) {
  this.start = start;
  this.finish = finish;
};

Interval.startAndLength = function(start, length) {
  return new Interval(start, start + length - 1);
};

Interval.prototype.getLength = function() {
  return this.finish - this.start + 1;
};

Interval.prototype.containsInterval = function(interval) {
  return this.contains(interval.start, interval.finish);
};
/*
Interval.prototype.contains = function(start, finish) {
  return start >= this.start && finish <= this.finish;
};
*/
Interval.prototype.intersects = function(interval) {
  return !(this.finish < interval.start ||
           this.start > interval.finish);
};

Interval.prototype.toString = function() {
	return '[' + this.start + ', ' + this.finish + ']';
};
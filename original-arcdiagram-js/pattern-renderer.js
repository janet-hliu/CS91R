var PatternRenderer = function(canvas, sequence, opt_base) {
	this.canvas = canvas;
	this.sequence = sequence;
	this.opt_base = opt_base;
};

PatternRenderer.prototype.render = function(minPatternLength) {
	var patternFinder = new PatternFinder(this.sequence, minPatternLength);
	var w = this.canvas.width;
	var h = this.canvas.height;
	var g = this.canvas.getContext('2d');
	var s = Math.min(w, 2 * h);
	var len = this.sequence.length;
	function scale(n) {
		return s * n / len;
	}
	g.fillStyle = '#fff';
	g.fillRect(0, 0, w, h);
	while (null != (match = patternFinder.nextMatch())) {
		var x1 = scale(match[0].start);
		var x2 = scale(match[0].finish);
		var x3 = scale(match[1].start);
		var x4 = scale(match[1].finish);
		var y = h;// / 2;
		var ox = (x2 + x3) / 2;
		var r1 = ox - x1;
		var r2 = ox - x2;
		g.beginPath();
		g.moveTo(x1, y);
		g.arc(ox, y, r1, -Math.PI, 0, false);
		g.moveTo(x3, y);
		g.arc(ox, y, r2, 0, -Math.PI, true);
	  if (!this.opt_base) {
	  	g.fillStyle = 'rgba(0,51,153,.2)';
	  } else {
	  	var d = this.opt_base[match[1].start] -
	  			    this.opt_base[match[0].start];
	  	if (d == 0) {
	  		g.fillStyle = 'rgba(0,51,153,.2)';
	  	} else {
		  	var p = (d + 1200) % 12;
		  	var hue = Math.floor(360 * p / 12);
		  	g.fillStyle = 'hsla(' + hue + ', 50%, 50%, 0.3)';
	  	}
	  }
		g.fill();
	}
};

PatternRenderer.makeDisplay = function(
		container, side, sequence, minPatternLength, opt_base) {
	var canvas = document.createElement('canvas');
	canvas.width = 2 * side;
	canvas.height = side;
	canvas.style.width = side + 'px';
	canvas.style.height = (side >> 1) + 'px';
	container.appendChild(canvas);
  var renderer = new PatternRenderer(canvas, sequence, opt_base);
  renderer.render(minPatternLength);
};
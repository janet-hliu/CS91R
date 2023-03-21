var PatternRenderer = function(canvas, sequence, opt_base) {
	this.canvas = canvas;
	this.sequence = sequence;
	this.opt_base = opt_base;
};

PatternRenderer.prototype.render = function(minPatternLength, hist, lastMatch, masterScale) {
	var patternFinder = new PatternFinder(this.sequence, minPatternLength);
	var w = this.canvas.width;
	var h = this.canvas.height;
	var g = this.canvas.getContext('2d');
	var s = Math.min(w, 2 * h);
	var baseH = s / 2;
	var len = this.sequence.length;

	if (masterScale < len) {
		masterScale += 0.08;
	}

	function scale(n) {
		return s * n / 20; //static scale
	}
	g.fillStyle = '#fff';
	g.fillRect(0, 0, w, h);
	// console.log('baseH', baseH, 'h', h);

	// Draw colored indicators for sequence values, if there are sufficiently few. This is the "debug" part.
	if (len < s) {
		var colors = {};
		var hue = 0;
		for (var i = 0; i < len; i++) {
			var symbol = this.sequence[i];
			if (!colors[symbol]) {
				hue = (hue + .61803398875) % 1;
				colors[symbol] = 'hsl(' + Math.round(360 * hue) + ', 60%, 70%)';
			}
			g.fillStyle = colors[symbol];
			var x = scale(i);
			var w = scale(i + 1) - x;
			g.fillRect(x, baseH, w, 20);
		}
	}

	var newLastMatch;
	var newHist = {};

	while (null != (match = patternFinder.nextMatch())) {
		//console.log(match);

		//we might need to check all matches due to certain edge cases. lastMatches rather than last match
		if (typeof newLastMatch != 'undefined') {
			if (match[1].finish >= newLastMatch[1].finish) {
				newLastMatch = match;
			}
		} else {
			newLastMatch = match;
		}

		if (hist.hasOwnProperty(match)) {
			if (hist[match] < 100) {
			newHist[match] = hist[match] + 2; //percentage of arc drawn
			} else {
			newHist[match] = 100;
			}
		} else if (typeof lastMatch !== 'undefined' && 
				match[0].start == lastMatch[0].start && 
				match[1].start == lastMatch[1].start) {// if both start intervals are the same
			newHist[match] = hist[lastMatch] + 2;
		} else {
			newHist[match] = 0;
		}
		
		var x1 = scale(match[0].start);
		var x2 = scale(match[0].finish + .9);
		var x3 = scale(match[1].start);
		var x4 = scale(match[1].finish + .9);
		var y = baseH;// / 2;
		var ox = (x2 + x3) / 2;
		
		var r1 = ox - x1;
		var r2 = ox - x2;

		g.beginPath();
		//g.moveTo(x1, y);
		g.arc(ox, y, r1, -Math.PI/100 * newHist[match], 0, false);
		//g.moveTo(x3, y);
		g.arc(ox, y, r2, 0, -Math.PI/100 * newHist[match], true);
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

	return [newHist, newLastMatch, masterScale];
};

PatternRenderer.makeDisplay = function(
		container, side, sequence, minPatternLength, opt_base) {
	var canvas = document.createElement('canvas');
	canvas.width = 2 * side;
	canvas.height = side;
	canvas.style.width = side + 'px';
	canvas.style.height = ((side >> 1) + 100) + 'px';
	container.appendChild(canvas);
  var renderer = new PatternRenderer(canvas, sequence, opt_base);
  renderer.render(minPatternLength);
};
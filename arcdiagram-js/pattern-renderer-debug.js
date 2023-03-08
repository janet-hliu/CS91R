var PatternRenderer = function(canvas, sequence, opt_base) {
	this.canvas = canvas;
	this.sequence = sequence;
	this.opt_base = opt_base;
};

PatternRenderer.prototype.render = function(minPatternLength, hist, lastMatch, masterScale, histR1, histR2) {
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
		return s * n / masterScale;
	}

	g.fillStyle = '#fff';
	g.fillRect(0, 0, w, h);

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
	var newHistR1;
	var newHistR2;
	var newHist = {};

	while (null != (match = patternFinder.nextMatch())) {
		newLastMatch = match;
		var r1 = undefined;

		// match has not expanded, just update percentage of arc drawn
		if (hist.hasOwnProperty(match)) {
			newHist[match] = [min(100, hist[match][0] + 2), min(100, hist[match][1] + 2), max(100, hist[match][2] - 2)]; 
		// match has expanded because start intervals of current match + last match are the same
		} else if (typeof lastMatch !== 'undefined' && 
				match[0].start == lastMatch[0].start && 
				match[1].start == lastMatch[1].start) {
			// radius1 percentage becomes lastr1/goalr1
			var x1 = scale(match[0].start);
			var x2 = scale(match[0].finish + .9);
			var x3 = scale(match[1].start);
			var ox = (x2 + x3) / 2;
			var goalr1 = ox - x1
			var goalr2 = ox - x2

			// historical radii relative to current radius/frame
			var relativeHistR1 = (histR1-ox)
			var relativeHistR2 = (histR2-ox)
			newHist[match] = [hist[lastMatch][0] + 2, 
							  min(relativeHistR1/goalr1*100, goalr1/relativeHistR1*100),
							  max(relativeHistR2/goalr2*100, goalr2/relativeHistR2*100)]
		// brand new match, add it to our history
		} else {
			newHist[match] = [0, 100, 100];
		}
		
		var x1 = scale(match[0].start);
		var x2 = scale(match[0].finish + .9);
		var x3 = scale(match[1].start);
		var ox = (x2 + x3) / 2;
		var y = baseH;

		var r1 = (ox - x1)/100 * newHist[match][1]
		// absolute edge of radius with respect to left edge of canvas
		newHistR1 = ox + r1
		var r2 = (ox - x2)/100 * newHist[match][2];
		newHistR2 = ox + r2
		g.beginPath();
		g.arc(ox, y, r1, -Math.PI/100 * newHist[match][0], 0, false);
		g.arc(ox, y, r2, 0, -Math.PI/100 * newHist[match][0], true);

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
	return [newHist, newLastMatch, masterScale, newHistR1, newHistR2];
};

PatternRenderer.makeDisplay = function(container, side, sequence, minPatternLength, opt_base) {
	var canvas = document.createElement('canvas');
	canvas.width = 2 * side;
	canvas.height = side;
	canvas.style.width = side + 'px';
	canvas.style.height = ((side >> 1) + 100) + 'px';
	container.appendChild(canvas);
	var renderer = new PatternRenderer(canvas, sequence, opt_base);
	renderer.render(minPatternLength);
};
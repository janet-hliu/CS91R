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
		masterScale += 0.04;
	}

	function scale(n) {
		return s * n / masterScale;
	}

	g.fillStyle = '#fff';
	g.fillRect(0, 0, w, h);
	console.log("sequence: "+this.sequence)
	console.log(len)

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
			console.log("x: "+x+", w: "+w)
			console.log(this.canvas.width)

			g.fillRect(x, baseH, w, 20);
		}
	}

	var newLastMatch;
	var newHist = {};

	// console.log("old hist: ")
	// console.log(hist)
	while (null != (match = patternFinder.nextMatch())) {
		newLastMatch = match;
		var r1 = undefined;

		// match has not expanded, just update percentage of arc drawn
		if (hist.hasOwnProperty(match)) {
			newHist[match] = [min(100, hist[match][0] + 2), min(100, hist[match][1] + 2)]; 
		// match has expanded because start intervals of current match + last match are the same
		} else if (typeof lastMatch !== 'undefined' && 
				match[0].start == lastMatch[0].start && 
				match[1].start == lastMatch[1].start) {
			// shrink radius percentage by match_len-1 / match_len
			match_len = match[0].getLength()
			// console.log("old radius: "+hist[lastMatch][1])
			// console.log("new radius: "+hist[lastMatch][1]*((match_len-1)/match_len))
			r1 = hist[lastMatch][1]
			// console.log("in if, " + r1)
			newHist[match] = [hist[lastMatch][0] + 2, hist[lastMatch][1]*((match_len-1)/match_len)];
		// brand new match, add it to our history
		} else {
			newHist[match] = [0, 100];
		}
		
		var x1 = scale(match[0].start);
		var x2 = scale(match[0].finish + .9);
		var x3 = scale(match[1].start);
		var x4 = scale(match[1].finish + .9);
		var y = baseH;
		var ox = (x2 + x3) / 2;
		// console.log(match[0].toString() + " " + match[1].toString());
		// console.log("type of r1: "+ (typeof r1 === 'undefined'));
		// if r1 is undefined, then we did not just expand the match. thus, can rely on newHist to have updated percentage
		// if the match was just expanded, we should maintain the previous percentage because we are still drawing based off
		// the old interval
		if (typeof r1 === 'undefined') {
			r1 = (ox - x1)/100 * newHist[match][1]
		} else {
			r1 = (ox - x1)/100 * r1
		};
		// var r1 = ox - x1;
		var r2 = ox - x2;
		// console.log("r1 "+r1);
		// console.log("r2 " +r2);
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
	// console.log("new hist: ")
	// console.log(newHist)
	return [newHist, newLastMatch, masterScale];
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

function demo() {
	var sequence = document.getElementById('poem1').textContent;
	var canvas = document.getElementById('output');
  var renderer = new PatternRenderer(canvas, sequence);
  renderer.render(0);
}
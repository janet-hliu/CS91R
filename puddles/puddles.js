var backgroundBlues = ["#001219", "#001524", "#003049", "#335C67", "#15616D", "#293241"];
var lumens = ["#D5C8DC", "#CDB4DB","#B5838D", "#D6AAB3", "#E6C7D3", "#DDC0C1", "#E5989B",
              "#3d5a80", "#00B4D8","#48CAE4", "#98C1D9", "#ADE8F4", "#e0fbfc", 
              "#005FA4", "#0085D7", "#0090ED", "#00EDFF",
              "#E77F65", "#F5EBB5", "#FFECD1"];
let notes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  stroke(255);
  strokeWeight(10);
  background(backgroundBlues[2]);

  for (let i = 0; i < 300; i++) {
    var initY = random(height);

    var goalX = max(random(3, 40), randomGaussian(0.35*width, 0.15*width));
    var goalY = random(10, height-10);

    var col = randomVal(lumens);
    append(notes, new Note(10, col, width + 20, initY, goalX, goalY));
  }
}

function draw() {
  // clear();
  background(backgroundBlues[2]);
  notes.forEach(function(note) {
    note.draw(); 
    note.update();
  })
}

function randomVal(arr) {
  return(arr[int(random(arr.length))])
}
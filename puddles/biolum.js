var backgroundBlues = ["#001219", "#001524", "#003049", "#335C67", "#15616D", "#293241"];
var lumens = ["#D5C8DC", "#CDB4DB","#B5838D", "#D6AAB3", "#E6C7D3", "#DDC0C1", "#E5989B",
              "#3d5a80", "#00B4D8","#48CAE4", "#98C1D9", "#ADE8F4", "#e0fbfc", 
              "#005FA4", "#0085D7", "#0090ED", "#00EDFF",
              "#E77F65", "#F5EBB5", "#FFECD1"];
let points = [];

function setup() {
  createCanvas(600, 600); //windowWidth, windowHeight);
  angleMode(DEGREES);
  stroke(255);
  strokeWeight(10);
  
  for (let i = 0; i < (min(width, height))/50; i++) {
    points[i] = createVector(random(width), random(height));
  }
  console.log(points)
  pixelDensity(1);
}

function draw() {
  // var canvas = document.getElementById('output', willReadFrequently=true);
  loadPixels();
  for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
      let distances = [];
      for(let i = 0; i < points.length; i++) {
        let d = dist(x, y, points[i].x, points[i].y);
        distances[i] = d;
      }

      let sorted = sort(distances);
      let noise = sorted[0];

      let index = (x+y*width)*4;
      pixels[index] = noise;
      pixels[index+1] = noise;
      pixels[index+2] = noise;
      pixels[index+3] = 255;
    }
  }
  updatePixels();

  beginShape(POINTS);
  for(let i = 0; i < points.length; i++) {
    vertex(points[i].x, points[i].y);
  }
  endShape();
  // noLoop();
}
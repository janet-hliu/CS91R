let screen;
let myShader;

let numParticles = 20;
let particles = [];
let t = 0;

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	screen = createGraphics(width, height);
	myShader = createShader(vertShader, fragShader);
	shader(myShader)
	
	for (let i = 0; i < 20; ++i) {
		let p = new Particle(random(width), height*0.25, t)
    particles.push(p)
	}
	screen.background('#141718')
}


function glowingCircle(part) {
	
	screen.fill(255);
	screen.noStroke();
	screen.circle(part.loc.x, part.loc.y, part.r);
}

// function mouseClicked() {
	
// 	if (numParticles < maxParticles) {
// 		var part = new Particle(mouseX, mouseY, t)
// 		particles.push(part);
// 		numParticles += 1;
// 	}
// }

function draw() {
	screen.background('#141718')
	for (var part in particles) {
	 	glowingCircle(particles[part])
		particles[part].update();
	}
	let shaderParticles = particles.reduce((acc, cur) => {
		acc = [...acc, cur.loc.x, cur.loc.y]
		return acc
	}, [])
	
	let noiseMag = 0.5
	let ns = map(noise(0.001*millis()), 0, 1, 1 - noiseMag, 1 + noiseMag);
	myShader.setUniform('numParticles', numParticles);
	myShader.setUniform('particles', shaderParticles);
	myShader.setUniform('texture', screen);
	myShader.setUniform('time', 0.0005*millis());
	rect(-width/2, -height/2, width, height)
	t += 1;
}

class Particle {
  constructor(x, y, t) {
    this.loc = createVector(x, y)
    this.r = 40;
		this.initTime = t;
  }
//   render() {
//     var col = mag(this.vel.x, this.vel.y);
//     //fill(col, col*50, col*200);
//     //ellipse(this.loc.x,this.loc.y,this.size)

//     stroke(col, col * 50, col * 150);
//     strokeWeight(this.size);
//     line(this.loc.x, this.loc.y, this.prev.x, this.prev.y) //coding train
//     this.prev.x = this.loc.x;
//     this.prev.y = this.loc.y;

//   }
  update() {
    this.r = 20 + 20/(0.01*(t-this.initTime) + 1) + sin(0.03*(t-this.initTime))
  }
}
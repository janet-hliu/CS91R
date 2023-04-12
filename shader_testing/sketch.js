let screen;
let myShader;

let numParticles = 2;
let particles = [];
let t = 0;

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	screen = createGraphics(width, height);
	myShader = createShader(vertShader, fragShader);
	shader(myShader)
	
	// for (let i = 1; i < 21; ++i) {
	// 	// let p = new Particle(i*width/20, height*0.25, t)
	// 	let p = new Particle(random(width), height*0.25, t)
	// 	console.log(p.loc.x);
    // 	particles.push(p)
	// }
	let p1 = new Particle(0, height*0.25, t);
	let p2 = new Particle(width, height*0.25, t);
	particles.push(p1);
	particles.push(p2);
	screen.background('#141718')
}

function draw() {
	// noLoop();
	let shaderParticles = particles.reduce((acc, cur) => {
		acc = [...acc, cur.loc.x, cur.loc.y]
		return acc
	}, [])
  	// console.log(shaderParticles)
	
	myShader.setUniform('numParticles', numParticles);
	myShader.setUniform('particles', shaderParticles);
	myShader.setUniform('texture', screen);
	myShader.setUniform('time', 0.0005*millis());
	rect(0, 0, width, height);
	t += 1;
}

class Particle {
  constructor(x, y, t) {
    this.loc = createVector(x, y)
    this.r = 40;
	this.initTime = t;
  }
}
class Position{
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Note {
  constructor(pointWeight, col, initX, initY, goalX, goalY) {
    this.pointWeight = pointWeight;
    this.pointCol = col;
    this.curPos = new Position(initX, initY);
    this.goalPos = new Position(goalX, goalY);
    this.hasRing = false;
    this.startTime = millis();
  }

  draw() {
    // drawings point and ring
    strokeWeight(this.pointWeight);
    stroke(this.pointCol);
    point(this.curPos.x, this.curPos.y);

    if (this.hasRing) {
      stroke(this.ringWeight);
      stroke(this.ringCol);
      circle(this.curPos.x, this.curPos.y, this.ringDiam);
    }
  }

  update() {
    // updates point color, point distance, etc. and ring color, radii
    // var elapsedTime = millis() - this.startTime;
    // var stepAmount = pow(elapsedTime, 1.0);
    // console.log(stepAmount)
    var lerpedX = lerp(this.curPos.x, this.goalPos.x, 0.05)
    var lerpedY = lerp(this.curPos.y, this.goalPos.y, 0.05)
    this.curPos = new Position(lerpedX, lerpedY);
  }

  addRing(weight, col, diam) {
    this.ringDiam = diam;
    this.ringCol = col;
    this.ringWeight = weight;
  }
}
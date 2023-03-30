class Position{
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  dist(pos) {
    var dx = pos.x - this.x;
    var dy = pos.y - this.y;
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  }
}

class Note {
  constructor(pointWeight, col, initX, initY, goalX, goalY) {
    this.pointWeight = pointWeight;
    this.pointCol = col;
    this.ogPointCol = col;
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

  update(backgroundCol) {
    // updates point color, point distance, etc. and ring color, radii
    // var elapsedTime = millis() - this.startTime;
    // var stepAmount = pow(elapsedTime, 1.0);
    // console.log(stepAmount)

    // if we are at the goal position, the point slowly fades out
    if (this.curPos.dist(this.goalPos) < 1) {
      this.curPos = this.goalPos;
      this.pointCol = lerpColor(color(this.pointCol), color(backgroundCol), 0.15);
    }
    var lerpedX = lerp(this.curPos.x, this.goalPos.x, 0.03)
    var lerpedY = lerp(this.curPos.y, this.goalPos.y, 0.03)
    this.curPos = new Position(lerpedX, lerpedY);
  }

  addRing(weight, col, diam) {
    this.ringDiam = diam;
    this.ringCol = col;
    this.ringWeight = weight;
  }
}
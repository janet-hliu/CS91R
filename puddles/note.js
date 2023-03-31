function colorDist(col1, col2) {
  let cola = color(col1);
  let colb = color(col2);
  let curCol = createVector(red(cola), green(cola), blue(cola));
  let goalCol = createVector(red(colb), green(colb), blue(colb));
  return curCol.dist(goalCol);
}

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
    this.ogGoalPos = this.goalPos;
    this.hasRing = false;
    this.ringCol = col;
    this.startTime = millis();
  }

  draw() {
    // drawings point and ring
    strokeWeight(this.pointWeight);
    stroke(this.pointCol);
    point(this.curPos.x, this.curPos.y);

    if (this.hasRing && this.curPos == this.goalPos) {
      stroke(this.ringWeight);
      stroke(this.ringCol);
      noFill();
      circle(this.curPos.x, this.curPos.y, this.ringDiam);
    }
  }

  update(backgroundCol) {
    // updates point color, point distance, etc. and ring color, radii
    // var elapsedTime = millis() - this.startTime;
    // var stepAmount = pow(elapsedTime, 1.0);
    // console.log(stepAmount)

    // update rings
    if (this.hasRing && this.curPos == this.goalPos) {
      // if (colorDist(this.ringCol, backgroundCol) < 100) {
      //   this.ringCol = backgroundCol;
      //   this.hasRing = false;
      //   return;
      // }

      this.ringDiam += 30;
      this.ringCol = lerpColor(color(this.ringCol), color(backgroundCol), 0.01);
    }

    // lerp point distance
    var lerpedX = lerp(this.curPos.x, this.goalPos.x, 0.03);
    var lerpedY = lerp(this.curPos.y, this.goalPos.y, 0.03);
    this.curPos = new Position(lerpedX, lerpedY);


    // if we are at the goal position, the point fades out
    if (this.curPos.dist(this.goalPos) < 1) {
      this.curPos = this.goalPos;

      // still are drawing ring, don't fade out point
      if (this.hasRing) {
        return;
      }

      if (colorDist(this.pointCol, backgroundCol) < 20) {
        this.pointCol = backgroundCol;
        return;
      }
      this.pointCol = lerpColor(color(this.pointCol), color(backgroundCol), 0.05);
    }
  }

  addRing(weight, col, diam) {
    this.ringDiam = diam;
    this.ringCol = this.pointCol;
    this.ringWeight = weight;
    this.hasRing = true;
  }

  setGoalPos(pos) {
    this.goalPos = pos;
  }
}
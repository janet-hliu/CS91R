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
  constructor(pointWeight, col, initX, initY, goalX, goalY, val) {
    this.pointWeight = pointWeight;
    this.pointCol = col;
    this.ogPointCol = col;
    this.curPos = new Position(initX, initY);
    this.goalPos = new Position(goalX, goalY);
    this.ogGoalPos = this.goalPos;
    this.hasRing = false;
    this.ringCol = col;
    this.startTime = millis();
    this.val = val;
  }

  draw(buffer, backgroundCol) {
    if (this.pointCol == backgroundCol) {
      return;
    }
    
    // drawings point and ring
    buffer.strokeWeight(this.pointWeight);
    buffer.stroke(this.pointCol);
    buffer.point(this.curPos.x, this.curPos.y);

    // if (this.hasRing && this.curPos == this.goalPos) {
    //   stroke(this.ringWeight);
    //   stroke(this.ringCol);
    //   noFill();
    //   circle(this.curPos.x, this.curPos.y, this.ringDiam);
    // }
  }

  update(backgroundCol) {
    // updates point color, point distance, etc. and ring color, radii
    // var elapsedTime = millis() - this.startTime;
    // var stepAmount = pow(elapsedTime, 1.0);
    // console.log(stepAmount)

    // should display ring if we a) have a ring + the current position is the goal
    if (this.hasRing && (this.curPos.dist(this.goalPos) < 1)) { // this.curPos == this.goalPos) {
      this.displayRing = true;
      // this.ringDiam += 30;
      // this.ringCol = lerpColor(color(this.ringCol), color(backgroundCol), 0.01);
    }

    // if we are at the goal position, the point fades out
    if (this.curPos.dist(this.goalPos) < 1) {
      this.curPos = this.goalPos;

      // still are drawing ring, don't fade out point
      // if (this.hasRing) {
      //   return;
      // }

      if (colorDist(this.pointCol, backgroundCol) < 20) {
        this.pointCol = backgroundCol;
        return;
      }
      this.pointCol = lerpColor(color(this.pointCol), color(backgroundCol), 0.05);
    } else {
      // lerp point distance
      let lerpedX = lerp(this.curPos.x, this.goalPos.x, 0.03);
      let lerpedY = lerp(this.curPos.y, this.goalPos.y, 0.03);
      this.curPos = new Position(lerpedX, lerpedY);
    }
  }

  addRing(weight, col, diam) {
    this.ringDiam = diam;
    this.ringCol = this.pointCol;
    this.ringWeight = weight;
    this.hasRing = true;
    this.newRing = false;
  }

  setGoalPos(pos) {
    this.goalPos = pos;
  }

  getAsciiVal() {
    return this.val;
  }

  getMidiVal() {
    return this.val.charCodeAt(0);
  }

  getPos() {
    return this.curPos;
  }

  shouldDisplayRing() {
    if (this.displayRing) {
      this.displayRing = false;
      this.hasRing = false;
      return true;
    }
    return false;
  }
}
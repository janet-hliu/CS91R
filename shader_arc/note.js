function colorDist(col1, col2) {
  let cola = color(col1);
  let colb = color(col2);
  let curCol = createVector(red(cola), green(cola), blue(cola));
  let goalCol = createVector(red(colb), green(colb), blue(colb));
  return curCol.dist(goalCol);
}

class Note {
  constructor(pointWeight, initX, initY, goalX, goalY, val) {
    this.pointWeight = pointWeight;
    this.curPos = createVector(initX, initY);
    this.goalPos = createVector(goalX, goalY);
    this.ogGoalPos = this.goalPos;
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
  }

  update(backgroundCol) {
    // updates point color, point distance, etc. and ring color, radii

    // should display ring if we a) have a ring + the current position is the goal
    if (this.hasRing && (this.curPos.dist(this.goalPos) < 1)) {
      this.displayRing = true;
    }

    // if we are at the goal position, the point fades out
    if (this.curPos.dist(this.goalPos) < 1) {
      this.curPos = this.goalPos;

      if (colorDist(this.pointCol, backgroundCol) < 20) {
        this.pointCol = backgroundCol;
        return;
      }
      this.pointCol = lerpColor(color(this.pointCol), color(backgroundCol), 0.05);
    } else {
      // lerp point distance
      let lerpedX = lerp(this.curPos.x, this.goalPos.x, 0.03);
      let lerpedY = lerp(this.curPos.y, this.goalPos.y, 0.03);
      this.curPos = createVector(lerpedX, lerpedY);
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
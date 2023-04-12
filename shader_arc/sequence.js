class Sequence{
  constructor(seq) {
    this.seq = seq;
  }

  concat(next) {
    this.seq.concat(next);
    var initY = random(height);

    var goalX = max(random(3, 40), randomGaussian(0.35*width, 0.15*width));
    var goalY = random(10, height-10);

    var col = randomVal(lumens);
    return(new Note(10, col, width + 20, initY, goalX, goalY));
  }

  clear() {
    this.seq = "";
  }

  get() {
    return this.seq;
  }
}
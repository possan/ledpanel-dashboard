var util = require('../lib/util');

var LifeScreen = function() {
  this.screenFrames = 200;
  this.fr = 0;
  this.g = new util.PixelBuffer();
  this.g2 = new util.PixelBuffer();
}

LifeScreen.prototype.seed = function(n) {
  for(var i=0; i<n * 3; i++) {
    var bx = Math.random() * 64;
    var by = Math.random() * 16;

    this.g.setPixel(bx, by, true);
    for(var k=0; k<3; k++) {
      this.g.setPixel(bx - 4 + Math.random() * 9, by - 4 + Math.random() * 9, true);
    }
  }

  for(var i=0; i<n; i++) {
    var bx = Math.random() * 54;
    var by = Math.random() * 16;
    this.g.setPixel(bx,by,true);
    this.g.setPixel(bx+1,by,true);
    this.g.setPixel(bx+2,by,true);
    this.g.setPixel(bx+2,by-1,true);
    this.g.setPixel(bx+1,by-2,true);
  }
}

LifeScreen.prototype.start = function() {
  this.g.clear();
  this.g2.clear();
  this.seed(1);
}

LifeScreen.prototype.update = function(adapter) {

  if (this.fr % 10 == 0) {
    this.seed(1);
  }

  if (this.fr % 1 == 0) {

    // iterate from g -> g2
    for(var j=0; j<16; j++) {
      for(var i=0; i<64; i++) {
        // ref: http://en.wikipedia.org/wiki/Conway's_Game_of_Life
        var me = this.g.getPixel(i,j);

        var nn = 0;
        nn += this.g.getPixel(i-1,j-1) ? 1 : 0;
        nn += this.g.getPixel(i,j-1) ? 1 : 0;
        nn += this.g.getPixel(i+1,j-1) ? 1 : 0;
        nn += this.g.getPixel(i-1,j) ? 1 : 0;
        nn += this.g.getPixel(i+1,j) ? 1 : 0;
        nn += this.g.getPixel(i-1,j+1) ? 1 : 0;
        nn += this.g.getPixel(i,j+1) ? 1 : 0;
        nn += this.g.getPixel(i+1,j+1) ? 1 : 0;

        var me2 = me;
        if (me) {
          // Any live cell with fewer than two live neighbours dies, as if caused by under-population.
          if (nn < 2) me2 = false;

          // Any live cell with two or three live neighbours lives on to the next generation.
          else if (nn == 2 || nn == 3 ) me2 = true;

          // Any live cell with more than three live neighbours dies, as if by overcrowding.
          else if (nn > 3) me2 = false;

        } else {

          // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
          if (nn == 3) me2 = true;
        }

        this.g2.setPixel(i,j,me2);
      }
    }
    // copy from g2 to g
    this.g.copyFrom(this.g2);
  }

  // draw
  adapter.update(this.g);

  this.fr ++;
}

exports.Screen = LifeScreen;

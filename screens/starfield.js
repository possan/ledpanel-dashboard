var util = require('../lib/util');

var StarfieldScreen = function() {
  this.screenFrames = 0;
  this.fr = 0;
  this.g = new util.PixelBuffer();
  this.stars = [];
  for(var i=0; i<100; i++) {
    this.stars.push({
      x: -100 + Math.random() * 200,
      y: -100 + Math.random() * 200,
      phase: Math.random() * 200,
    });
  }
}

StarfieldScreen.prototype.start = function() {
}

function rotate(x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * x) - (sin * y),
        ny = (sin * x) + (cos * y);
    return [nx, ny];
}

StarfieldScreen.prototype.update = function(adapter) {
  this.g.clear();

  for(var i=0; i<100; i++) {
    var s = this.stars[i];

    var rot1 = rotate(s.x, s.y, this.fr * 1.5);

    var x1 = rot1[0];
    var y1 = rot1[1];
    var z1 = 100 - ((s.phase + this.fr * 4.0) % 200);

    var rot2 = rotate(x1, z1, this.fr * 0.9);

    var x2 = rot2[0];
    var y2 = y1;
    var z2 = rot2[1];

    var sx = 32 + x2 / (3.0 + z2 / 20);
    var sy = 8 + y2 / (3.0 + z2 / 20);

    if (z2 > 0 && z2 < 80) {
      if (z2 < 10) {
        this.g.setPixel(sx, sy, true);
        this.g.setPixel(sx-1, sy, true);
        this.g.setPixel(sx+1, sy, true);
        this.g.setPixel(sx, sy-1, true);
        this.g.setPixel(sx, sy+1, true);
      } else {
        this.g.setPixel(sx, sy, true);
      }
    }
  }

  // draw
  adapter.update(this.g);

  this.fr ++;
}

exports.Screen = StarfieldScreen;

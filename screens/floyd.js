var util = require('../lib/util');

var FloydSteinbergScene = function() {
  this.screenFrames = 150;
  this.fr = 0;
  this.solo = false;
  this.g = new util.PixelBuffer();
}

FloydSteinbergScene.prototype.start = function() {
}

FloydSteinbergScene.prototype.update = function(adapter) {
  this.g.clear();

  for(var y=0; y<16; y++) {
    for(var x=0; x<64; x++) {
      var g = util.lerp(x, 0, 63, 0, 255);
      this.g.setPixel(x, y, g + 64 * Math.sin(x / 8.0 + this.fr / 6.0) * 1 * Math.cos(y / 7.0 + this.fr / 5.0));
    }
  }

  this.g.dither();

  adapter.update(this.g);

  this.fr += 0.3;
}

exports.Screen = FloydSteinbergScene;

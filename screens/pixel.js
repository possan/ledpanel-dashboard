var util = require('../lib/util');

var SinglePixelScreen = function() {
  this.screenFrames = 0;
  this.g = new util.PixelBuffer();
}

SinglePixelScreen.prototype.update = function(adapter) {
  this.g.clear();
  this.g.setPixel(Math.random() * 64, Math.random() * 16, true);
  adapter.update(this.g);
}

exports.Screen = SinglePixelScreen;

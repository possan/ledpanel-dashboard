var util = require('../lib/util');

var InterferenceScreen = function() {
  this.screenFrames = 0;
  this.g = new util.PixelBuffer();
  this.fr = 0;
}

InterferenceScreen.prototype.update = function(adapter) {
  this.g.clear();
  var cx0 = 32 + 16 * Math.cos(this.fr / 24.3);
  var cy0 = 8 + 13 * Math.sin(this.fr / 19.9);
  var cx1 = 32 + 25 * Math.sin(this.fr / 21.9);
  var cy1 = 8 + 20 * Math.cos(this.fr / 13.1);
  for(var j=0; j<16; j++) {
    for(var i=0; i<64; i++) {
    	var d0 = Math.sqrt( (i - cx0) * (i - cx0) + (j - cy0) * (j - cy0) );
    	var d1 = Math.sqrt( (i - cx1) * (i - cx1) + (j - cy1) * (j - cy1) );
    	var t0 = (Math.round(d0 / 4.0) % 2.0) > 0.5;
    	var t1 = (Math.round(d1 / 4.0) % 2.0) > 0.5;
  	  this.g.setPixel(i, j, t0 ^ t1);
    }
  }
  adapter.update(this.g);
  this.fr ++;
}

exports.Screen = InterferenceScreen;

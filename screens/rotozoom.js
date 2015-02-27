var util = require('../lib/util');
var gif = require('../lib/gif');
var fs = require('fs');

var RotoZoomScreen = function() {
  this.screenFrames = 300;
  this.fr = 0;
  this.g = new util.PixelBuffer();
  this.g2 = new util.PixelBuffer(128, 64);
  var blob = fs.readFileSync('rotozoom.gif', 'binary');
  var _this = this;
  this.texture = new util.PixelBuffer(128, 128);
  var palette = [];
  gif.parseGIF(new gif.Stream(blob), {
    hdr: function(d) {
      console.log('got header', d);
      palette = d.gct;
    },
    img: function(d) {
      console.log('got frame', d.topPos, d.leftPos, d.width, d.height, d.pixels.length, palette);
      for(var j=0; j<d.height; j++) {
        for(var i=0; i<d.width; i++) {
          var c = palette[d.pixels[j * d.width + i]];
          // console.log(c);
          _this.texture.setPixel(i, j, c[0]);
        }
      }
    }
  });

}

RotoZoomScreen.prototype.start = function() {
}

function curve(t, x) {
	var xt = x / 17.0 + t;
	return -2.0 * Math.sin(xt / 14.1+Math.sin(xt / 28.3)) - 1.0 * Math.sin(xt / 9.6 + t / 30.0);
}

RotoZoomScreen.prototype.update = function(adapter) {
  this.g.clear();
  this.g2.clear();

  var dx = 60.0 * curve(this.fr / 3.9, this.fr / 8.7);
  var dy = 60.0 * curve(this.fr / 4.1, this.fr / 7.9);

  var rr = this.fr * 3;//  60.0 * curve(this.fr / 9.1, this.fr / 5.9);

  var zz = 3.0 + 0.5 * curve(this.fr / 6.0, this.fr / 9.0);

  for(var y=0; y<32; y++) {
    for(var x=0; x<128; x++) {

      var u2 = (x - 64) * zz + dx;
      var v2 = (y - 16) * zz + dy;

      var t = util.rotate(u2, v2, rr);

      u2 = t[0];
      v2 = t[1];

      u2 += this.texture.width * 1000;
      v2 += this.texture.height * 1000;

      u2 %= this.texture.width;
      v2 %= this.texture.height;

      this.g2.setPixel(x, y, this.texture.getPixel(u2, v2) );
    }
  }

  this.g.downsampleFrom(this.g2);
  this.g.dither();
  adapter.update(this.g);

  this.fr += 0.3;
}

exports.Screen = RotoZoomScreen;

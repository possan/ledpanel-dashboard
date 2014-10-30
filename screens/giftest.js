var util = require('../lib/util');
var gif = require('../lib/gif');
var fs = require('fs');

var GifTestScreen = function() {
  this.screenFrames = 150;
  this.fr = 0;
  this.g = new util.PixelBuffer();
  this.img = null;
  this.frames = [];
  this.header = {};
  var blob = fs.readFileSync('test.gif', 'binary');
  var _this = this;
  gif.parseGIF(new gif.Stream(blob), {
  	hdr: function(d) {
      // console.log('got header', d);
      _this.header = d;
  	},
  	img: function(d) {
      // console.log('got frame ' + _this.frames.length + ' image data', d.topPos, d.leftPos, d.width, d.height, d.pixels.length);
      _this.frames.push(d);
  	}
  });
  // console.log(this.img);
  // process.exit(1);
}

GifTestScreen.prototype.start = function() {
}

GifTestScreen.prototype.update = function(adapter) {
  this.g.clear();
  if (this.frames.length > 0) {
  	var f = this.frames[Math.floor(this.fr % this.frames.length)];
  	for(var j=0; j<f.height; j++) {
      for(var i=0; i<f.width; i++) {
        var x = 32 + (((f.leftPos + i) - (this.header.width >> 1)) >> 2);
        var y = 8 + (((f.topPos + j) - (this.header.height >> 1)) >> 2);
        var o = j * f.width + i;
        var c = f.pixels[o];
        if (c != this.header.bgColor) {
      		var rgb = this.header.gct[c];
       	 	var g = ((rgb[0] + rgb[1] + rgb[2]) % 768.0) > 256.0;
        	this.g.setPixel(x, y, g);
        }
      }
  	}
    this.fr += 0.33;
  }
  adapter.update(this.g);
}

exports.Screen = GifTestScreen;

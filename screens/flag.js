var util = require('../lib/util');

var FlagScreen = function() {
  this.screenFrames = 250;
  this.fr = 0;
  this.g = new util.PixelBuffer();
  this.flag = [
   // DDDDDD OOOOOO OOOOOO ZZZZZZ EEEEEE RRRRRR
    " 1111    1111   1111  111111  11111 11111  ",
    " 11 11  11  11 11  11 11  11 11     11  11 ",
    " 11  11 11  11 11  11     11 11     11  11 ",
    " 11  11 11  11 11  11    11  11     11  11 ",
    " 11  11 11  11 11  11   11   1111   11111  ",
    " 11  11 11  11 11  11  11    11     11  11 ",
    " 11  11 11  11 11  11 11     11     11  11 ",
    " 11 11  11  11 11  11 11  11 11     11  11 ",
    " 1111    1111   1111  111111  11111 11  11 ",
  ]
}

FlagScreen.prototype.start = function() {
}

function lerp(i,in0,in1,out0,out1) {
  var f = (i - in0) / (in1 - in0);
  f = (f * (out1 - out0)) + out0;
  return f;
}

FlagScreen.prototype.update = function(adapter) {
  this.g.clear();

  var fh = this.flag.length;
  var fw = this.flag[0].length;

  for(var j=0; j<16; j++) {
    for(var i=0; i<64; i++) {

      var x2 = lerp(i+0.5, 0, 64, -3, fw+3 );
      var y2 = lerp(j+0.5, 0, 16, -3, fh+3 );

      x2 += 3.0 * Math.sin(this.fr / 8.0 + j / 20.0 - i / 9.0);
      x2 += 1.0 * Math.cos( i / 6.0 + this.fr / 19.0 + j / 34.0 );

      y2 += 3.0 * Math.cos(this.fr / 7.0 + i / 5.0 + j / 11.0);
      y2 += 1.0 * Math.sin( i / 7.0 + j / 10.0 + this.fr / 5.0 );

      x2 = Math.floor(x2);
      y2 = Math.floor(y2);

      var fp = false;
      if (x2 >= 0 && x2 < fw && y2 >= 0 && y2 < fh) {
        fp = this.flag[y2].substring(x2, x2+1) != ' ';
      }

      this.g.setPixel(i, j, fp);
    }
  }

  adapter.update(this.g);

  this.fr ++;
}

exports.Screen = FlagScreen;

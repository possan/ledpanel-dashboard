var util = require('../lib/util');

var TwisterScreen = function() {
  this.screenFrames = 300;
  this.fr = 0;
  this.g = new util.PixelBuffer();
  this.g2 = new util.PixelBuffer(128, 64);
  this.flag = [
   // 123456789 123456789 123456789 123456789 123456789 123456789 123
    "                                                                ",
    "                                                                ",
    " 111111111   111111   11    11   1111111    1111111   111111111 ",
    " 111111111  11111111  111   11  111111111  111111111  111111111 ",
    "    11  11  11 11 11  1111  11  11     11  11     11  11     11 ",
    "    11  11  11 11 11  11111 11  11     11  11     11  11     11 ",
    "    11  11  11 11 11  11 11111  11     11  11     11  11     11 ",
    "    11  11  11 11 11  11  1111  11     11  11     11  11     11 ",
    " 111111111  11 11 11  11   111  111111111  111111111  111111111 ",
    " 1111 111   11    11  11    11   1111111    1111111    1111111  ",
    "                                                                ",
    "                                                                ",
  ]
  this.flag2 = [
   // 123456789 123456789 123456789 123456789 123456789 123456789 123
    "111111 111111 111111 111111 111111 111111 111111 111111 111111 1",
    "11111 111111 111111 111111 111111 111111 111111 111111 111111 11",
    "1111 111111 111111 111111 111111 111111 111111 111111 111111 111",
    "111 111111 111111 111111 111111 111111 111111 111111 111111 1111",
    "11 111111 111111 111111 111111 111111 111111 111111 111111 11111",
    "1 111111 111111 111111 111111 111111 111111 111111 111111 111111",
    " 111111 111111 111111 111111 111111 111111 111111 111111 1111111",
  ]
  this.flag3 = [
   // 123456789 123456789 123456789 123456789 123456789 123456789 123
    "                                                                ",
    "                                                                ",
    "1     1     1     1     1     1     1     1     1     1     1   ",
    "                                                                ",
    "                                                                ",
    "   1     1     1     1     1     1     1     1     1     1     1",
    "                                                                ",
    "                                                                ",
    "1     1     1     1     1     1     1     1     1     1     1   ",
    "                                                                ",
    "                                                                ",
  ]
}

TwisterScreen.prototype.start = function() {
}

function curve(t, x) {
	var xt = x / 17.0 + t;
	return -2.0 * Math.sin(xt / 14.1+Math.sin(xt / 28.3)) - 1.0 * Math.sin(xt / 9.6 + t / 30.0);
}

function texLine(g, x, y0, y1, u, v0, v1, flag, shade) {
	for(var y=Math.round(y0); y<=Math.round(y1); y++) {
	  	var v = util.lerp(y, y0, y1, v0, v1);
	 	var scanline = flag[Math.floor(v)];//  == '1');
		if (scanline) {
			var uu = Math.floor(u) % (flag[0].length - 1);
		  	var fp = scanline.substring(uu, uu+1) == '1' ? 255 : 0;
        fp += shade;
		  	g.setPixel(x, y, fp);
	  	}
	}
}

TwisterScreen.prototype.update = function(adapter) {
  this.g.clear();
  this.g2.clear();

  for(var y=0; y<32; y++) {
    for(var x=0; x<128; x++) {
      this.g2.setPixel(x, y, (((y+x)%7)==0) ? 255 : 0);
    }
  }

  for(var x=0; x<128; x++) {
  	var a = this.fr * 6 + curve(this.fr, x * 3) * 33.0;
    var ra = 1.3 * curve(this.fr * 3, x * 4.0);
    var dy = 2.0 * curve(this.fr * 3, -x * 4.0);

  	var R = 12 + ra;

    //        t0
    //    p0 ----- p1
    //    |        |
    // t3 |        | t1    0deg
    //    |        |
    //    p3 ----- p2
    //        t2

  	var p0 = util.rotate(-R, -R, a);
  	var p1 = util.rotate( R, -R, a);
  	var p2 = util.rotate( R,  R, a);
  	var p3 = util.rotate(-R,  R, a);

  	// var t0 = util.rotate( 0, -1, a - 90 + 180);
  	// var t1 = util.rotate( 1,  0, a - 90 + 180);
  	// var t2 = util.rotate( 0,  1, a - 90 + 180);
  	// var t3 = util.rotate(-1,  0, a - 90 + 180);

  	var y0 = p0[1] + 16.0 + dy;
  	var y1 = p1[1] + 16.0 + dy;
  	var y2 = p2[1] + 16.0 + dy;
  	var y3 = p3[1] + 16.0 + dy;

    var n0 = p1[0] - p0[0];
    var n1 = p2[0] - p1[0];
    var n2 = p3[0] - p2[0];
    var n3 = p0[0] - p3[0];

  	var s0 = 25.0 * (n0 - 0.5) / R;
  	var s1 = 25.0 * (n1 - 0.5) / R;
  	var s2 = 25.0 * (n2 - 0.5) / R;
  	var s3 = 25.0 * (n3 - 0.5) / R;

  	// var u = x / 2.0 + this.fr * 3.0;
  	var u = util.lerp(x, 0, 128, 0, this.flag[0].length - 1);

  	if (y1 > y0) texLine(this.g2, x, y0, y1, u, 0, this.flag.length, this.flag, s0);
  	if (y2 > y1) texLine(this.g2, x, y1, y2, u, 0, this.flag2.length, this.flag2, s1);
  	if (y3 > y2) texLine(this.g2, x, y2, y3, u, 0, this.flag.length, this.flag, s2);
  	if (y0 > y3) texLine(this.g2, x, y3, y0, u, 0, this.flag3.length, this.flag3, s3);
  }

  this.g.downsampleFrom(this.g2);
  this.g.dither();
  adapter.update(this.g);

  this.fr += 0.3;
}

exports.Screen = TwisterScreen;

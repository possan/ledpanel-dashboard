var util = require('../lib/util');

var TwisterScreen = function() {
  this.screenFrames = 150;
  this.fr = 0;
  this.solo = true;
  this.g = new util.PixelBuffer();
  this.flag = [
   // DDDDDD OOOOOO OOOOOO ZZZZZZ EEEEEE RRRRRR
    // "1111111111111111111111111111111111111111111",
    // "                                           ",
    // "                                           ",
    // " 1111    1111   1111  111111  11111 11111  ",
    // " 11 11  11  11 11  11 11  11 11     11  11 ",
    // " 11  11 11  11 11  11     11 11     11  11 ",
    // " 11  11 11  11 11  11    11  11     11  11 ",
    // " 11  11 11  11 11  11   11   1111   11111  ",
    // " 11  11 11  11 11  11  11    11     11  11 ",
    // " 11  11 11  11 11  11 11     11     11  11 ",
    // " 11 11  11  11 11  11 11  11 11     11  11 ",
    // " 1111    1111   1111  111111  11111 11  11 ",
    // "                                           ",
    // "                                           ",
    // "1111111111111111111111111111111111111111111",
   // 123456789 123456789 123456789 123456789 123456789 123456789 123
    "1111111111111111111111111111111111111111111111111111111111111111",
    "                                                                ",
    "                                                                ",
    "   1111111    111111   11    11   111111    111111   1111       ",
    "   11111111  11111111  11    11  11111111  11111111  11111      ",
    "         11  11 11 11  111   11  11    11  11    11  11 11      ",
    "         11  11 11 11  1111  11  11    11  11    11  11 11      ",
    "         11  11 11 11  11111 11  11    11  11    11  11 11      ",
    "         11  11 11 11  11 11111  11    11  11    11  11 11      ",
    "         11  11 11 11  11  1111  11    11  11    11  11 11      ",
    "         11  11 11 11  11   111  11    11  11    11  11 11      ",
    "         11  11 11 11  11    11  11111111  11111111  11111111   ",
    "         11  11  111   11    11   111111    111111    1111111   ",
    "                                                                ",
    "                                                                ",
    "1111111111111111111111111111111111111111111111111111111111111111",
  ]
}

TwisterScreen.prototype.start = function() {
}

function lerp(i,in0,in1,out0,out1) {
  var f = (i - in0) / (in1 - in0);
  f = (f * (out1 - out0)) + out0;
  return f;
}

function rotate(ox, oy, angle) {
    var radians = angle * Math.PI / 180.0,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * ox) - (sin * oy),
        ny = (sin * ox) + (cos * oy);
    return [nx, ny];
}

function curve(t, x) {
	var xt = x / 17.0 + t;
	return 2.0 * Math.sin(xt / 14.1+Math.sin(xt / 28.3)) - Math.sin(xt / 9.6 + t / 30.0) + t / 20.0;
}

function texLine(g, x, y0, y1, u, v0, v1, flag, shade) {
	for(var y=Math.round(y0); y<=Math.round(y1); y++) {
	  	var v = lerp(y, y0, y1, v0, v1);
	 	var scanline = flag[Math.floor(v)];//  == '1');
		if (scanline) {
			var p50 = (Math.round(x + y) % 2) == 0;
			var uu = Math.floor(u) % (flag[0].length - 1);
		  	var fp = scanline.substring(uu, uu+1) == '1';
		  	if (shade < -0.8)
		  		fp |= p50;
		  	if (shade < -0.9)
		  		fp = true;
		  	if (shade > 0.60)
		  		fp &= p50;
		  	if (shade > 0.9)
		  		fp = false;
		  	g.setPixel(x, y, fp);
	  	}
	}
}

TwisterScreen.prototype.update = function(adapter) {
  this.g.clear();

  for(var x=0; x<64; x++) {
  	var a = curve(this.fr, x) * 90.0;

  	var R = 9.0;

  	var p0 = rotate(-R, -R, a);
  	var p1 = rotate( R, -R, a);
  	var p2 = rotate( R,  R, a);
  	var p3 = rotate(-R,  R, a);

  	var t0 = rotate( 0, -1, a);
  	var t1 = rotate( 1,  0, a);
  	var t2 = rotate( 0,  1, a);
  	var t3 = rotate(-1,  0, a);

  	var y0 = p0[1] + 8.0;
  	var y1 = p1[1] + 8.0;
  	var y2 = p2[1] + 8.0;
  	var y3 = p3[1] + 8.0;

  	var s0 = 1.0 * t0[1];
  	var s1 = 1.0 * t1[1];
  	var s2 = 1.0 * t2[1];
  	var s3 = 1.0 * t3[1];

  	// var u = x / 2.0 + this.fr * 3.0;
  	var u = lerp(x, 0, 64, 0, this.flag[0].length);

  	if (y1 > y0) texLine(this.g, x, y0, y1, u + 0, 0, 15, this.flag, s0);
  	if (y2 > y1) texLine(this.g, x, y1, y2, u + 0, 0, 15, this.flag, s1);
  	if (y3 > y2) texLine(this.g, x, y2, y3, u + 0, 0, 15, this.flag, s2);
  	if (y0 > y3) texLine(this.g, x, y3, y0, u + 0, 0, 15, this.flag, s3);
  }

  adapter.update(this.g);

  this.fr += 0.3;
}

exports.Screen = TwisterScreen;

var util = require('../lib/util');

var WireCubeScreen = function() {
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

WireCubeScreen.prototype.start = function() {
}

function rotate(x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * x) - (sin * y),
        ny = (sin * x) + (cos * y);
    return [nx, ny];
}

var R = 12.0;

var vtx = [
	[ -R, -R, -R ],
	[  R, -R, -R ],
	[ -R,  R, -R ],
	[  R,  R, -R ],
	[ -R, -R,  R ],
	[  R, -R,  R ],
	[ -R,  R,  R ],
	[  R,  R,  R ]
];

var sides = [
	[0, 1], [2, 3], [4, 5], [6, 7],
	[0, 2], [2, 6], [6, 4], [4, 0],
	[1, 3], [3, 7], [7, 5], [5, 1]
];

WireCubeScreen.prototype.update = function(adapter) {
  this.g.clear();
  /*

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
  */

  var x, y, z, x2, y2, z2, r;

  var tmp = [];
  for(var i=0; i<vtx.length; i++) {

  	x = vtx[i][0];
  	y = vtx[i][1];
  	z = vtx[i][2];

  	r = rotate(x, z, this.fr * 3.0);
  	x = r[0];
  	z = r[1];

  	r = rotate(y, z, this.fr * 2.0);
  	y = r[0];
  	z = r[1];

  	r = rotate(x, y, this.fr * 3.6);
  	x = r[0];
  	y = r[1];

    var sx = 32 + x / (1.5 + z / 40);
    var sy = 8 + y / (1.5 + z / 40);

  	tmp[i] = [ sx, sy ];
  };

  for(var j=0; j<sides.length; j++) {
  	var v0 = tmp[ sides[j][0] ];
  	var v1 = tmp[ sides[j][1] ];
    this.g.drawLine( v0[0], v0[1], v1[0], v1[1], true );
  }

  for(var j=0; j<600; j++) {
  	if (j % 40 < 30)
  		continue;
  	var x = Math.sin(j * Math.PI / 300.0 + this.fr / 80.0);
  	var y = Math.cos(j * Math.PI / 300.0 + this.fr / 80.0);
  	this.g.drawLine(
  		32 + x * 16,
  		8 + y * 16,
  		32 + x * 100,
  		8 + y * 100,
  		true );
  }

  // draw
  adapter.update(this.g);

  this.fr += 1;
}

exports.Screen = WireCubeScreen;

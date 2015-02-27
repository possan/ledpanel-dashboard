var util = require('../lib/util');
var normalize = require('vectors/normalize')(3)
var mult = require('vectors/mult')(3)
var add = require('vectors/add')(3)

var FreeDirectionTunnel = function() {
  this.screenFrames = 0;
  this.fr = 0;
  this.texture = [];
  for(var x = 0; x < 256; x++) {
    for(var y = 0; y < 256; y++) {
        this.texture.push(((x/16) ^ (y/4)) & 1);
    }
  }
  this.g = new util.PixelBuffer();
}

function rotate(x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * x) - (sin * y),
        ny = (sin * x) + (cos * y);
    return [nx, ny];
}

FreeDirectionTunnel.prototype.putColor = function(x, y, g) {
  var direction = [x-32.0, y-8.0, 20.0];

  direction = normalize(direction);        // normalize Direction vector

  var r = rotate(direction[0], direction[1], this.fr);
  direction[0] = r[0];
  direction[1] = r[1];

  var r = rotate(direction[0], direction[2], this.fr * 2.2);
  direction[0] = r[0];
  direction[2] = r[1];

  var r = rotate(direction[1], direction[2], this.fr * 1.5);
  direction[1] = r[0];
  direction[2] = r[1];

  var origin = [0.0, 0.0, -256.0 + this.fr];


  // calculate the stuff :-)
  var a = Math.pow(direction[0],2) + Math.pow(direction[1],2);
  var b = 2.0*(origin[0]*direction[0] + origin[1]*direction[1]);
  var c = Math.pow(origin[0], 2) + Math.pow(origin[1],2) - Math.pow(32.0, 2);

  // calculate discriminent delta
  var delta = Math.pow(b, 2) - 4.0*a*c;

  // if there's no real solution
  if (delta < 0)
    {
      g.setPixel(x,y, false);
      return;
    }

  var t,t1,t2;
  // there are 2 solutions, get the nearest ... this case should never happen
  t1 = (-b + Math.sqrt(delta))/(2.0*a);
  t2 = (-b - Math.sqrt(delta))/(2.0*a);
  t = Math.min(t1, t2);                      // min here

  // finnally the intersection
  var intersection = [0,0,0];
  add(intersection, origin);
  mult(direction, t);
  add(intersection, direction);

// do the mapping
  var u = (Math.abs(intersection[2])* 0.1);
  var v = (Math.abs(Math.atan2(intersection[1], intersection[0])* 128/Math.PI));

  u = u % 256;
  v = v % 256;
  u = ~~u;
  v = ~~v;
  var color = (this.texture[v * 256 + u] == 0 ? false : true);
  g.setPixel(x,y, color);
}


FreeDirectionTunnel.prototype.update = function(adapter) {
  this.g.clear();

  for(var x = 0; x < 64; x++) {
    for(var y = 0; y < 16; y++) {
        this.putColor(x,y, this.g);
    }
  }

  this.fr += 1;
  adapter.update(this.g);
}

exports.Screen = FreeDirectionTunnel;

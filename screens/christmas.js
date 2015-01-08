var util = require('../lib/util');
var moment = require('moment');

var ChristmasScreen = function() {
  this.screenFrames = 0;
  this.fr = 0;
  this.g = new util.PixelBuffer();

  this.candlewidth = 12;
  this.candleheight = 14;

  this.snowflakes = [];
  for(var i=0; i<30; i++) {
    this.snowflakes.push({
      x: 4 + (Math.random() * 56),
      y: -25.0 + Math.random() * 30.0,
      t: -20.0 + Math.random() * 30.0,
      r1: 4.0 + Math.random(),
      r2: 2.0 + Math.random(),
    })
  }

  this.flame = {
    width: 8,
    height: 8,
    rate: 3,
    frames: [
      [
        '.......',
        '.......',
        '.......',
        '...1...',
        '...11..',
        '..111..',
        '..11...',
        '..>1<..',
      ],
      [
        '.......',
        '.......',
        '.......',
        '...1...',
        '..11...',
        '..111.',
        '..11...',
        '..>1<..',
      ],
      [
        '......',
        '.......',
        '.......',
        '..1...',
        '..11...',
        '..111.',
        '...1..',
        '..>1<..',
      ],
      [
        '.......',
        '.......',
        '.......',
        '...1....',
        '...11...',
        '..111..',
        '...11..',
        '..>1<..',
      ],
      [
        '.......',
        '.......',
        '.......',
        '....1..',
        '...1...',
        '..111..',
        '...11..',
        '..>1<..',
      ],
      [
        '.......',
        '.......',
        '....1..',
        '...11..',
        '..11..',
        '..111.',
        '...1..',
        '..>1<..',
      ],
      [
        '....1..',
        '.......',
        '...1...',
        '...11..',
        '..11..',
        '..111.',
        '...1..',
        '..>1<..',
      ],
    ]
  },

  this.moss = {
    width: 64,
    height: 5,
    rate: 1,
    frames: [
      [
        //      III             III             III             III       <
        //      III             III             III             III       <
        '1...1...x......_....1..._.....11_.1....._......._......._.......1',
        '1.11....x....1._..111..._.......111...._.....1._......._.....1..1',
        '111.1...x..1..11.11111...._....11111.1...._..111..1_......._..111',
        '111111......111111111...x..1.111111111..x..111111111.1.....1.1111',
        '11111111111111111111111111111111111111111111111111111111111111111',
        //1234567_1234567_1234567_1234567_1234567_1234567_1234567_1234567_<
      ]
    ]
  }

}

function lerp(i,in0,in1,out0,out1) {
  var f = (i - in0) / (in1 - in0);
  f = (f * (out1 - out0)) + out0;
  return f;
}

ChristmasScreen.prototype.activate = function() {
}

ChristmasScreen.prototype.deactivate = function() {
}

ChristmasScreen.prototype.start = function() {
}

ChristmasScreen.prototype.drawSprite = function(sprite, x, y, frame) {
  var n = Math.floor((frame / sprite.rate) % (sprite.frames.length));
  var fd = sprite.frames[n];
  for(var yd=0; yd<sprite.height; yd++) {
    for(var xd=0; xd<sprite.width; xd++) {
      var c = sprite.frames[n][yd].substring(xd, xd+1);
      if (c == '1') {
        this.g.setPixel(x+xd, y+yd, true);
      }
    }
  }
}

ChristmasScreen.prototype.drawCandle = function(x, ap, frame) {
  // magic constant madness
  var pclamp = Math.max(0.0, Math.min(1.0, ap));
  var h = lerp(ap, -0.1, 2.5, 10.0, 4.0);
  var hclamp = Math.min(10.0, Math.max(4.0, h));
  var frac = hclamp % 1.0;
  for(var y=0; y<Math.round(hclamp); y++) {
    if (y == Math.round(hclamp) - 1) {
      // last line will smooth off a bit
      this.g.setPixel(x, 13 - y, true);
      this.g.setPixel(x-1, 13 - y, frac > 0.33);
      this.g.setPixel(x+1, 13 - y, frac > 0.66);
    } else {
      this.g.setPixel(x, 13 - y, true);
      this.g.setPixel(x-1, 13 - y, true);
      this.g.setPixel(x+1, 13 - y, true);
    }
  }
  if (h > 4.1 && h < 10.0) {
    this.drawSprite(this.flame, x-3, (13 - hclamp) - 6, frame);
  }
}

ChristmasScreen.prototype.update = function(adapter) {
  this.g.clear();

  // some magic constants
  var firstAdvent = new Date('2014-11-30 00:00:00 +0000');
  var fourthAdvent = new Date('2014-12-24 00:00:00 +0000');
  var christmas = new Date('2014-12-24 15:00:00 +0000');
  var now = new Date();
  // now = new Date('2014-12-20 15:00:00 +0000'); // mock date

  var progress = lerp(now, firstAdvent, fourthAdvent, 0.0, 3.0);

  // calc advent progress
  var a1p = lerp(progress, 0.0, 1.0, 0.0, 1.0);
  var a2p = lerp(progress, 1.0, 2.0, 0.0, 1.0);
  var a3p = lerp(progress, 2.0, 3.0, 0.0, 1.0);
  var a4p = lerp(progress, 3.0, 4.0, 0.0, 1.0);

  // draw candles
  this.drawCandle(8 + 0, a1p, this.fr + 3);
  this.drawCandle(8 + 16, a2p, this.fr + 13);
  this.drawCandle(8 + 32, a3p, this.fr + 16);
  this.drawCandle(8 + 48, a4p, this.fr + 21);

  // calc overall progress
  var pp = Math.round(lerp(progress, 0.0, 3.0, 8.0, 48+8.0));
  var blink = (this.fr % 16) < 8;

  // draw progress
  for(var i=0; i<64; i++) {
    this.g.setPixel(i, 15, (i == pp) ? blink : (i > pp));
  }

  // invert advent points
  this.g.setPixel(8 + 0, 15, !this.g.getPixel(8 + 0, 15));
  this.g.setPixel(8 + 16, 15, !this.g.getPixel(8 + 16, 15));
  this.g.setPixel(8 + 32, 15, !this.g.getPixel(8 + 32, 15));
  this.g.setPixel(8 + 48, 15, !this.g.getPixel(8 + 48, 15));

  // overlay the moss
  this.drawSprite(this.moss, 0, 10, 0);

  // draw some snow
  for(var i=0; i<this.snowflakes.length; i++) {
    var sf = this.snowflakes[i];

    var dx = sf.r1 * Math.sin(sf.t / 4.0)
    var dy = sf.r2 * Math.cos(sf.t / 5.0)
    var x = sf.x + dx;
    var y = sf.y + dy;

    if (y >= 0.0 && y < 14.0)
      this.g.setPixel(x, y, true);

    sf.t += 0.5;
    sf.y += 0.33;
    if (sf.y > 14.0) {
      sf.y -= 20.0 + Math.random() * 10.0;
    }
  }

  // boom
  adapter.update(this.g);

  this.fr ++;
}

exports.Screen = ChristmasScreen;

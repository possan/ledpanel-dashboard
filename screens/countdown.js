var util = require('../lib/util');
var moment = require('moment');

var CountdownScreen = function() {
  this.screenFrames = 800;
  this.fr = 0;
  this.g = new util.PixelBuffer();
}

function lerp(i,in0,in1,out0,out1) {
  var f = (i - in0) / (in1 - in0);
  if (f < 0) f = 0;
  if (f > 1) f = 1;
  f = (f * (out1 - out0)) + out0;
  return f;
}

CountdownScreen.prototype.drawBar = function(g, y, h, value, max_value) {
  var tot = 64 * h;
  var w = (64 * h * value) / max_value;
  // console.log('w', w, tot);
  var o = 0;
  for(var i=0; i<64; i++) {
  	for(var j=h-1; j>=0; j--) {
      if (o < w) this.g.setPixel(i, y+j, true);
      o ++;
		}
	}
}

CountdownScreen.prototype.update = function(adapter) {
  this.g.clear();

  // some magic constants
  var start = (new Date('2015-03-01 00:00:00 +0000')).getTime() / 1000.0;
  var christmas = (new Date('2015-03-30 00:11:00 +0100')).getTime() / 1000.0;
  var now = (new Date()).getTime() / 1000.0;
  // now = (new Date('2015-04-28 03:07:30 +0000')).getTime() / 1000.0;

	var max_days = 12;

  var progress = christmas - now;
  if (progress < 0) {
  	progress = 0;
	}

	//  var progress = 64*16 - lerp(now, start, christmas, 0, 64*16);

  var first_bar_minutes = 5.0;

  var max_first_bar = 60.0 * first_bar_minutes;
  var progress_first_bar = progress % max_first_bar;
  progress -= progress_first_bar;
  progress /= max_first_bar;

  var progress_rest = progress;
  var max_rest = 24.0 * (60.0 / first_bar_minutes) * max_days;

	this.drawBar(this.g, 0, 4, progress_first_bar, max_first_bar);
	this.drawBar(this.g, 5, 11, progress_rest, max_rest);

  adapter.update(this.g);

  this.fr ++;
}

exports.Screen = CountdownScreen;

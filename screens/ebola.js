var util = require('../lib/util');
var moment = require('moment');

var EbolaScreen = function() {
  this.screenFrames = 50;
  this.fr = 0;
  this.g = new util.PixelBuffer();
}

EbolaScreen.prototype.activate = function() {
}

EbolaScreen.prototype.deactivate = function() {
}

EbolaScreen.prototype.start = function() {
}

EbolaScreen.prototype.update = function(adapter) {
  this.g.clear();

  var str = 'TIME TO EBOLA';
  for(var c=0; c<str.length; c++) {
    this.g.drawChar(str.substring(c, c+1), 5 + 4 * c + 3 * Math.sin(this.fr / 13.0 + c / 5.0 ), 3 + 3.0 * Math.sin(this.fr / 10.0 + c / 2.1));
  }

  var countDownTill = new Date('2014-12-24 00:00:30 +0000');
  var now = new Date();

  var diff = moment(countDownTill).diff(now);
  var days = moment(countDownTill).diff(now, 'days');
  var seconds = moment(countDownTill).diff(now, 'seconds');
  var duration = moment.duration(diff);

  var twochars = function(s) {
    s = '' + s;
    if (s.length < 2)
      s = '0' + s;
    return s;
  }

  str = days + 'd '
      + twochars(duration.hours()) + ':'
      + twochars(duration.minutes()) + ':'
      + twochars(duration.seconds());

  this.g.drawString(str, 1, 11, 0);//(new Date()).toString().substring(16, 24), 12 + 12 * Math.sin(fr/40.0), 11, 0);

  adapter.update(this.g);

  this.fr ++;
}

exports.Screen = EbolaScreen;

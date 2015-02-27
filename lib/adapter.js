var SerialPort = require("serialport");
var util = require('./util');
var fs = require('fs');

var Adapter = function() {
  this.serialPort = null;
  this.open = false;
  this.g = new util.PixelBuffer();
  this.scanrow = 0;
  this.preview = false;
}

Adapter.prototype._queueSend = function() {
  // update one row
  var bytes = 8;
  var perstep = 2;
  var packet = new Buffer((5 + bytes) * perstep);
  var pi = 0;

  for(var k=0; k<perstep; k++) {
    var o = this.scanrow * 8;
    packet[pi++] = 'W'.charCodeAt(0);
    packet[pi++] = o & 255;
    packet[pi++] = o >> 8;
    packet[pi++] = bytes & 255;
    packet[pi++] = bytes >> 8;

    var o2 = this.scanrow * 64;
    for(var j=0; j<bytes; j++) {
      var b = 0;
      for(var k=0; k<8; k++) {
        if (this.g.pixels[o2 ++]) b |= 1 << k;
      }
      packet[pi++] = b;
    }

    this.scanrow ++;
    if (this.scanrow > 15)
      this.scanrow = 0;
  }

  if (this.open && this.serialPort) this.serialPort.write(packet);

}

Adapter.prototype._gotAck = function() {
  setTimeout(this._queueSend.bind(this), 0);
}

Adapter.prototype.findSerial = function(callback) {
  console.log('Adapter: looking for serial ports..');
  var foundport = null;
  var files = fs.readdirSync('/dev');
  if (files) {
    files.forEach(function(port) {
      if (/tty\.usb/.test(port)) {
        foundport = '/dev/' + port;
      }
    });
  }

  callback(foundport);
}

Adapter.prototype.connectSerial = function(port) {
	console.log('Adapter: connectSerial: ' + port);

  var _this = this;

  var _this = this;
  this.serialPort = new SerialPort.SerialPort(port, { baudrate: 57600 });
  this.serialPort.on("open", function () {
    console.log('Adapter: serial port opened.');
    _this.serialPort.write(new Buffer('C'));
    _this.open = true;
  });

  this.serialPort.on("data", function (data) {
    if (data.toString().substring(0, 1) == 'K') { _this._gotAck(); }
  });

  this.serialPort.on("close", function (data) {
    _this.open = false;
    console.log('Adapter: serial port closed.');
  });
}

Adapter.prototype.update = function(pixelbuffer) {
	// console.log('Adapter: update', pixelbuffer);

  if (pixelbuffer) this.g.copyFrom(pixelbuffer);

  if (this.preview) {
    var o = 0;
    var all = '';
    all += '.';
    for(var x=0; x<64; x++) {
      all += '--';
    }
    all += '.\n';
    for(var y=0; y<16; y++) {
      all += '|';
      for(var x=0; x<64; x++) {
        var p0 = this.g.pixels[y * 64 + x];
        if (p0 >= 192) all += '##';
        else if (p0 >= 128) all += '::';
        else if (p0 >= 64) all += '..';
        else all += '  ';
        o ++;
      }
      all += '|';
      all += '\n';
    }
    all += '\'';
    for(var x=0; x<64; x++) {
      all += '--';
    }
    all += '\'\n';
    // all = '\033[2J' + all;
    console.log(all);
  }
}

Adapter.prototype.start = function() {
	console.log('Adapter: start...');
}

exports.Adapter = Adapter;

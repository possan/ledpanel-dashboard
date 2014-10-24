var SerialPort = require("serialport");
var util = require('./util');

var Adapter = function() {
  this.serialPort = null;
  this.open = false;
  this.g = new util.PixelBuffer();
  this.scanrow = 0;
}

Adapter.prototype._queueSend = function() {
  // update one row
  var o = this.scanrow * 8;
  var bytes = 8;

  var packet = new Buffer(5 + bytes);

  packet[0] = 'W'.charCodeAt(0);

  packet[1] = o & 255;
  packet[2] = o >> 8;

  packet[3] = bytes & 255;
  packet[4] = bytes >> 8;

  var o2 = scanrow * 64;
  for(var j=0; j<bytes; j++) {
    var b = 0;
    for(var k=0; k<8; k++) {
      if (this.g.pixels[o2 ++]) b |= 1 << k;
    }
    packet[5 + j] = b;
  }

  if (this.open && this.serialPort) this.serialPort.write(packet);

  this.scanrow ++;
  this.scanrow %= 16;
}

Adapter.prototype._gotAck = function() {
  setTimeout(this._queueSend.bind(this), 1);
}

Adapter.prototype.findSerial = function(callback) {
  console.log('Adapter: looking for serial ports..');
  callback(null);
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
    if (data.toString().substring(0, 1) == 'K') { _this.gotAck(); }
  });

  this.serialPort.on("close", function (data) {
    _this.open = false;
    console.log('Adapter: serial port closed.');
  });

  gotAck();
}

Adapter.prototype.update = function(pixelbuffer) {
	console.log('Adapter: update', pixelbuffer);

  if (pixelbuffer) this.g.copyFrom(pixelbuffer);

  var o = 0;
  var all = '';
  for(var y=0; y<16; y++) {
    for(var x=0; x<64; x++) {
      all += this.g.pixels[o] ? '()' : '  '
      o ++;
    }
    all += '\n';
  }

  console.log('\033[2J' + all);
}

Adapter.prototype.start = function() {
	console.log('Adapter: start...');
}

exports.Adapter = Adapter;

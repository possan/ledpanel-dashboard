Led screen dashboard hack
=========================

Write your own screen
---------------------

Simplest possible screen (`screens/pixel.js`), draws a pixel at a random position every frame:

```
var util = require('../lib/util');

var SinglePixelScreen = function() {
  this.screenFrames = 10;
  this.g = new util.PixelBuffer();
}

SinglePixelScreen.prototype.update = function(adapter) {
  this.g.clear();
  this.g.setPixel(Math.random() * 64, Math.random() * 16, true);
  adapter.update(this.g);
}

exports.Screen = SinglePixelScreen;
```

Test locally
`node test.js pixel`

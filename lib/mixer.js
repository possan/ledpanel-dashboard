var Mixer = function() {
	this.providers = [];
	this.currentProvider = 0;
	this.timer = 0;
	this.soloProvider = null;
}

Mixer.prototype.addProvider = function(provider) {
	if (provider.screenFrames > 0)
		this.providers.push(provider);
	if (provider.solo)
		this.soloProvider = provider;
}

Mixer.prototype.update = function(adapter) {
	if (this.providers.length == 0)
		return;

	var p = this.soloProvider || this.providers[this.currentProvider % this.providers.length];

	if (this.timer == 0 && p.activate) p.activate();

	var nf = p.screenFrames;

	// console.log('Mixer: using provider', p, this.timer, nf);

	if (p.update) p.update(this.adapter);

	this.timer ++;
	if (this.timer >= nf) {
		if (p.deactivate) p.deactivate();
		console.log('Mixer: switch provider...');
		this.currentProvider ++;
		this.timer = 0;
	}
}

Mixer.prototype.queueFrame = function() {
	if (this.frameTimer) clearTimeout(this.frameTimer);
	var _this = this;
	this.frameTimer = setTimeout(function() {
		_this.update();
		_this.frameTimer = 0;
		_this.queueFrame();
	}, 16);
}

Mixer.prototype.start = function(adapter) {
	this.adapter = adapter;
	if (this.providers.length == 0) {
		console.log('Mixer: no providers!');
		return;
	}
	console.log('Mixer: start...');
	this.adapter.start();
	this.providers.forEach(function(p) {
		if (p.start) p.start();
	});
	this.timer = 0;
	this.queueFrame();
}

exports.Mixer = Mixer;

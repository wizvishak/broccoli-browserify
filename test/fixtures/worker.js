// workers/sample-worker.js

'use strict';

var syllable = require('syllable');

function SampleWorker(self) {
	self.onmessage = function (event) {
		var params = event.data;
		self.postMessage(params);
	};
}

module.exports = SampleWorker;

'use strict';

var stew = require('broccoli-stew').log;
var pickFiles = require('broccoli-funnel');

var browserify = require('../lib');

var worker = new pickFiles('fixtures', {
	includes: ['**/*.js']
});

var haddock = new browserify(stew(worker), {
	srcDir: 'fixtures',
	config: {
		entries: ['./main.js'],
		outputFile: 'workers/sample-worker.js'
	}
});

module.exports = haddock;

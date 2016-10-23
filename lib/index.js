var fs = require('fs');
var path = require('path');
var RSVP = require('rsvp');
var mkdirp = require('mkdirp');
var browserify = require('browserify');
var CachingWriter = require('broccoli-caching-writer');

function BrowserifyWriter(inputNodes, options) {
	options = options || {};
	this.srcDir = options.srcDir;

	CachingWriter.call(this,
		Array.isArray(inputNodes) ? inputNodes : [inputNodes], {
			annotation: options.annotation
		});

	options = options.config || {};
	this.entries = options.entries || [];
	this.outputFile = options.outputFile || '/browserify.js';
	this.browserifyOptions = options.browserify || {};
	this.bundleOptions = options.bundle || {};
	this.requireOptions = options.require || {};
}

BrowserifyWriter.prototype = Object.create(CachingWriter.prototype);
BrowserifyWriter.prototype.constructor = BrowserifyWriter;

BrowserifyWriter.prototype.build = function () {
	var entries = this.entries;
	var outputFile = this.outputFile;
	var browserifyOptions = this.browserifyOptions;
	var bundleOptions = this.bundleOptions;
	var requireOptions = this.requireOptions;
	var destDir = this.outputPath;

	mkdirp.sync(path.join(destDir, path.dirname(outputFile)));

	browserifyOptions.basedir = this.srcDir;
	var b = browserify(browserifyOptions);

	for (var i = 0; i < entries.length; i++) {
		b.add(entries[i]);
	}
	for (var i = 0; i < requireOptions.length; i++) {
		b.require.apply(b, requireOptions[i]);
	}

	return new RSVP.Promise(function (resolve, reject) {
		b.bundle(bundleOptions, function (err, data) {
			if (err) {
				reject(err);
			} else {
				fs.writeFileSync(path.join(destDir, outputFile), data);
				resolve(destDir);
			}
		});
	});
};

module.exports = BrowserifyWriter;

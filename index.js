'use strict';
var glob = require('glob');
var os = require('os');

// API

function expand(args) {
	var files = args;
	if (os.platform() === 'win32') {
		files = [];
		for (var pattern of args) {
			for (var file of glob.sync(pattern, {
				nonull: true,
				nosort: true,
			})) {
				files.push(file);
			}
		}
	}
	if (files.length === 1 && files[0] === '-') {
		files = [];
	}
	return files;
}

exports.expand = expand;

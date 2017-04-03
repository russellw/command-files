'use strict';
var fs = require('fs');
var glob = require('glob');
var os = require('os');

function response(arg, files) {
	var file = arg.slice(1);
	var text = fs.readFileSync(file, {
		encoding: 'utf8',
	});
	var lines = text.split(/\r?\n/);
	for (var line of lines) {
		if (line[0] === '@') {
			response(line, files);
			continue;
		}
		files.push(line);
	}
}

// API

function expand(args) {

	// - means stdin
	if (args.length === 1 && args[0] === '-') {
		return [];
	}

	// Glob
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

	// Response files
	var lines = files;
	files = [];
	for (var line of lines) {
		if (line[0] === '@') {
			response(line, files);
			continue;
		}
		files.push(line);
	}
	return files;
}

exports.expand = expand;

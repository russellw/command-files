'use strict'
var fs = require('fs')
var glob = require('glob')
var os = require('os')

function dive(dir, callback, output) {
	var files = fs.readdirSync(dir)
	for (var file of files) {
		var path = dir + '/' + file
		var stats = fs.statSync(path)
		if (stats.isDirectory()) {
			dive(path, callback, output)
			continue
		}
		if (callback(path))
			output.push(path)
	}
}

function expand(args, callback) {
	// - means stdin
	if (args.length === 1 && args[0] === '-')
		return []

	// Glob
	var output = args
	if (os.platform() === 'win32') {
		output = []
		for (var pattern of args)
			for (var file of glob.sync(pattern, {
				nonull: true,
				nosort: true,
			}))
				output.push(file)
	}

	// Response files
	var lines = output
	output = []
	for (var line of lines) {
		if (line[0] === '@') {
			response(line, output)
			continue
		}
		output.push(line)
	}

	// Directory
	if (!callback)
		return output
	var files = output
	output = []
	for (var file of files) {
		var path = file
		try {
			var stats = fs.statSync(path)
			if (stats.isDirectory()) {
				dive(path, callback, output)
				continue
			}
		} catch (e) {
		}
		output.push(path)
	}
	return output
}

function response(arg, output) {
	var file = arg.slice(1)
	var text = fs.readFileSync(file, {
		encoding: 'utf8',
	})
	var lines = text.split(/\r?\n/)
	for (var line of lines) {
		if (!line)
			continue
		if (line[0] === '@') {
			response(line, output)
			continue
		}
		output.push(line)
	}
}

exports.expand = expand

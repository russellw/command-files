#!/usr/bin/env node

'use strict'
var index = require('./index')

var args = process.argv.slice(2)
var files = index.expand(args, function (file) {
	return file.endsWith('.js')
})
for (var file of files)
	console.log(file)

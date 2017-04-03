A typical command line program accepts options and file arguments. Options are handled well by existing packages such as `commander`. File arguments are handled by `command-files`.

- Convert a single `-` argument to an empty list of arguments; commonly, these are two ways to specify reading from stdin; now a program need check for only one case. (If this isn't what you want, simply test it separately before calling `command-files`.)

- On Windows, where the shell doesn't do it for you, expand wild cards.

- Expand response files, where `@` prefixes the name of a file containing a list of other files.

- Optionally, recursively expand a directory argument to a list of files, filtered by a callback function. For example, a program can choose to interpret a directory argument as a list of only those contained files that match a set of known extensions.

API:

```
files = commandFiles.expand(args[, callback]);
```

Example usage:

```
var commander = require('commander');
// Use commander to obtain options
var args = commander.args;

var commandFiles = require('command-files');
var files = commandFiles.expand(args, function (file) {
	return file.endsWith('.js');
});
```

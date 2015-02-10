#!/usr/bin/env node

'use strict';

var childProcess = require('child_process'),
    fs = require('fs'),
    path = require('path');

var async = require('async'),
    buntstift = require('buntstift'),
    program = require('commander'),
    updateNotifier = require('update-notifier');

var packageJson = require('../package.json');

var directories,
    directoriesCount,
    directoriesFailCount;

updateNotifier({
  packageName: packageJson.name,
  packageVersion: packageJson.version
}).notify();

program
  .version(packageJson.version)
  .usage('[options] <command>')
  .option('--color', 'enforce color output')
  .option('--no-color', 'disable color output')
  .option('-v, --verbose', 'verbose output')
  .parse(process.argv);

if (process.argv.length === 2) {
  program.help();
}

directories = fs.readdirSync(process.cwd());

directoriesCount = directories.length;
directoriesFailCount = 0;

async.eachSeries(directories, function (directory, callback) {
  var directoryAbsolute = path.join(process.cwd(), directory);

  if (!fs.statSync(directory).isDirectory()) {
    directoriesCount--;
    return callback(null);
  }

  childProcess.exec(program.args, {
    cwd: directoryAbsolute
  }, function (err, stdout, stderr) {
    if (err) {
      directoriesFailCount++;
      buntstift.error('{{directory}} (exit code: {{code}})', { directory: directory, code: err.code });
      buntstift.verbose(stderr);
      return callback(null);
    }

    buntstift.success('{{directory}}', { directory: directory });
    buntstift.verbose(stdout);
    callback(null);
  });
}, function () {
  if (directoriesFailCount > 0) {
    return buntstift.warn('Processing {{count}} of {{total}} directories failed.', { count: directoriesFailCount, total: directoriesCount });
  }

  buntstift.success('Successfully processed {{count}} directories.', { count: directoriesCount });
});

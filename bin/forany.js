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

var isVerbose = function () {
  return (process.argv.indexOf('--verbose') !== -1) || (process.argv.indexOf('-v') !== -1);
};

updateNotifier({
  packageName: packageJson.name,
  packageVersion: packageJson.version
}).notify();

program.
  version(packageJson.version).
  usage('[options] <command>').
  option('--color', 'enforce color output').
  option('--no-color', 'disable color output').
  option('-v, --verbose', 'verbose output').
  parse(process.argv);

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

  if (isVerbose()) {
    buntstift.info('Processing {{directory}}...', { directory: directory });
    buntstift.newLine();
  }

  buntstift.waitFor(function (stopWaiting) {
    childProcess.exec(program.args, {
      cwd: directoryAbsolute
    }, function (err, stdout, stderr) {
      stopWaiting();

      if (err) {
        directoriesFailCount++;
        buntstift.verbose(stderr.replace(/\n/g, '\n  '));
        buntstift.error('{{directory}} (exit code: {{code}})', { directory: directory, code: err.code });
        return callback(null);
      }

      buntstift.verbose(stdout.replace(/\n/g, '\n  '));
      buntstift.success('{{directory}}', { directory: directory });

      if (isVerbose()) {
        buntstift.line();
      }

      callback(null);
    });
  });
}, function () {
  if (!isVerbose()) {
    buntstift.line();
  }

  if (directoriesFailCount > 0) {
    return buntstift.warn('Processing {{count}} of {{total}} directories failed.', { count: directoriesFailCount, total: directoriesCount });
  }
  buntstift.success('Successfully processed {{count}} directories.', { count: directoriesCount });
});

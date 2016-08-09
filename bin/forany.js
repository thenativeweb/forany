#!/usr/bin/env node

'use strict';

const childProcess = require('child_process'),
      fs = require('fs'),
      os = require('os'),
      path = require('path');

// Parsing the ~/.forany.json file *must* happen before loading any npm modules,
// because they check the CLI flags on startup.
try {
  /* eslint-disable global-require */
  const dotfile = require(path.join(os.homedir(), '.forany.json'));
  /* eslint-enable global-require */

  if (dotfile.verbose) {
    process.argv.push('--verbose');
  }
  if (dotfile.noColor) {
    process.argv.push('--no-color');
  }
  if (dotfile.color) {
    process.argv.push('--color');
  }
} catch (ex) {
  // If no .forany.json exists, nevermind.
}

const async = require('async'),
      buntstift = require('buntstift'),
      program = require('commander'),
      updateNotifier = require('update-notifier');

const packageJson = require('../package.json');

const isVerbose = function () {
  return process.argv.includes('--verbose') || process.argv.includes('-v');
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

/* eslint-disable no-sync */
const directories = fs.readdirSync(process.cwd());
/* eslint-enable no-sync */

let directoriesCount = directories.length,
    directoriesFailCount = 0;

async.eachSeries(directories, (directory, callback) => {
  const directoryAbsolute = path.join(process.cwd(), directory);

  /* eslint-disable no-sync */
  if (!fs.statSync(directory).isDirectory()) {
    /* eslint-enable no-sync */
    directoriesCount -= 1;

    return callback(null);
  }

  if (isVerbose()) {
    buntstift.info('Processing {{directory}}...', { directory });
    buntstift.newLine();
  }

  buntstift.waitFor(stopWaiting => {
    childProcess.exec(program.args, {
      cwd: directoryAbsolute
    }, (err, stdout, stderr) => {
      stopWaiting();

      if (err) {
        directoriesFailCount += 1;
        buntstift.verbose(stderr.replace(/\n/g, '\n  '));
        buntstift.error('{{directory}} (exit code: {{code}})', { directory, code: err.code });

        if (isVerbose()) {
          buntstift.line();
        }

        return callback(null);
      }

      buntstift.verbose(stdout.replace(/\n/g, '\n  '));
      buntstift.success('{{directory}}', { directory });

      if (isVerbose()) {
        buntstift.line();
      }

      callback(null);
    });
  });
}, () => {
  if (!isVerbose()) {
    buntstift.line();
  }

  if (directoriesFailCount > 0) {
    return buntstift.warn('Processing {{count}} of {{total}} directories failed.', { count: directoriesFailCount, total: directoriesCount });
  }
  buntstift.success('Successfully processed {{count}} directories.', { count: directoriesCount });
});

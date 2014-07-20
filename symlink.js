#!/usr/bin/env node
var argv = require('optimist')
  .usage('Usage: $0 [-d] -r repoDir [-g globals]')
  .describe('g', 'globally-link')
  .boolean('d')
  .describe('d', 'dry-run')
  .demand(['r'])
  .describe('r', 'repoDir')
  .argv;

// can do multiple -g globX chains
var globals = argv.g ? (Array.isArray(argv.g) ? argv.g : [argv.g]): []
var dir = require('path').join(process.cwd(), argv.r);
var cp = require('child_process');
var async = require('async');

require('./')(dir, globals, function (err, cmds) {
  if (err) {
    throw err;
  }

  if (argv.d) { // dry run
    console.log(JSON.stringify(cmds, null, " "));
  }
  else {
    // create one cp function cmd that execs and cbs to next in async series
    var execs = cmds.map(function (cmd) {
      return function (cb) {
        console.log(cmd);
        cp.exec(cmd, function (error, stdout) {
          console.log(stdout);
          if (error !== null) {
            console.log('exec error: ' + error);
          }
          cb(error);
        });
      };
    });

    // exec commands synchronously
    async.series(execs);
  }
});

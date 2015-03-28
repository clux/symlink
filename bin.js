#!/usr/bin/env node
var argv = require('yargs')
  .usage('Usage: symlink <repoDirs> [options]')
  .demand(1)
  .example('symlink ./repos')
  .example('symlink ./repos -g coveralls -g nodeunit')
  .alias('d', 'dry-run')
  .describe('d', 'Print the commands to be executed and exit')
  .boolean('d')
  .alias('g', 'global')
  .describe('g', 'globally installed module to be linked')
  .array('g') // NB: will be unset if not used (default strings are ugly)
  .alias('h', 'help')
  .help('h')
  .argv;

// can do multiple unnamed arguments for directories relative to cwd
var join =  require('path').join;
var dirs = argv._.map(function (dir) {
  return join(process.cwd(), dir);
});
var cp = require('child_process');
var async = require('async');

require('./')(dirs, argv.g || [], function (err, cmds) {
  if (err) {
    console.error(err.message);
    process.exit(1);
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
          cb(error);
        });
      };
    });

    // exec commands synchronously
    async.series(execs, function (err) {
      if (err) {
        console.error(err.message);
        process.exit(1);
      }
      process.exit(0);
    });
  }
});

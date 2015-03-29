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

require('./lib/cli').run(argv, function (err) {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
  process.exit(0);
});

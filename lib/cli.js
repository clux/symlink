var cp = require('child_process');
var path = require('path');
var async = require('async');

var handleError = function (err) {
  if (err) {
    throw err;
  }
};

var dryRunHandler = function (err, cmds) {
  handleError(err);
  console.log(JSON.stringify(cmds, null, " "));
};

var executeHandler = function (err, cmds) {
  handleError(err);
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
  async.series(execs, handleError);
};


exports.run = function (argv) {
  // repoDirs are the unnamed arguments (usually just one super dir)
  var dirs = argv._.map(function (dir) {
    return path.join(process.cwd(), dir);
  });

  // execute main module function with one of the handlers as the cb
  var handler = argv.d ? dryRunHandler : executeHandler;
  require('./symlink')(dirs, argv.g || [], handler);
};

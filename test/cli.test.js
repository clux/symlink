var cli = require('../').cli;
var fs = require('fs');
var async = require('async');
var cp = require('child_process');

exports.enoent = function (t) {
  var argv = {
    _ : [ './test/missing_dir' ]
  };

  cli.run(argv, function (err) {
    t.ok(/ENOENT/.test(err), "ENOENT exception from cli");
    t.done();
  });
};

exports.ecyclical = function (t) {
  var argv = {
    _ : [ './test/cyclicals' ]
  };
  cli.run(argv, function (err) {
    t.ok(/cannot link cyclically dep/.test(err), "cyclical deps");
    t.done();
  });
};

// success cases (thes log a bit)
exports.dryRun = function (t) {
  var argv = {
    _ : [ './test/ok' ],
    d: true
  };

  cli.run(argv, function (err) {
    t.ok(!err, "no error on dry run");
    t.done();
  });
};

exports.executePass = function (t) {
  var argv = {
    _ : [ './test/ok' ],
  };

  cli.run(argv, function (clierr) {
    t.ok(!clierr, "execute did not throw");
    // verify that linking actually occurred
    fs.lstat('./test/ok/parent/node_modules/dep', function (err, stat) {
      t.ok(!err, "could get stat of link");
      t.ok(stat.isSymbolicLink(), "dep linked from parent");
      t.done();
    });
  });
};

var cli = require('../').cli;


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


/*
harder to handle non failures..
exports.dryRun = function (t) {
  var argv = {
    _ : [ './test' ],
    d: true
  };

  cli.run(argv, function (err) {
    t.ok(!err, "no error on dry run");
    t.done();
  });

  t.done();
};
*/

var tap = require('tap')
  , test = tap.test
  , cp = require('child_process');

var verify = function (t, flags, expected) {
  cp.exec('../symlink.js ' + flags, function (err, stdout, stderr) {
    if (err || stderr) {
      t.equal(err, null, "err executing");
      t.equal(stderr, null, "err executing");
    }
    else {
      t.ok(stdout, flags + ' worked');
      var json = JSON.parse(stdout);
      t.ok(Array.isArray(json), 'array of output');
      t.equal(json.length, expected.length, "same number of cmds");
      for (var i = 0; i < json.length; i += 1) {
        var endBit = json[i].match(/\/symlink\/(.*)/)[1];
        t.equal(endBit, expected[i], "got expected line " + i);
      }
    }
    t.end();
  });
};

test("symlink-dry-run 0 globals", function (t) {
  var flags = '-r . -d';
  var output = [
    "test/module2 && npm install external1 external2 global1",
    "test/module2 && npm link",
    "test/module3 && npm link module2",
    "test/module3 && npm install global2",
    "test/module3 && npm link",
    "test/module1 && npm link module2 module3",
    "test/module1 && npm install external2",
    "test/module1 && npm link"
  ];
  verify(t, flags, output);
});

test("symlink-dry-run 1 global", function (t) {
  var flags = '-r . -d -g global1';
  var output = [
    "test/module2 && npm link global1",
    "test/module2 && npm install external1 external2",
    "test/module2 && npm link",
    "test/module3 && npm link module2",
    "test/module3 && npm install global2",
    "test/module3 && npm link",
    "test/module1 && npm link module2 module3",
    "test/module1 && npm install external2",
    "test/module1 && npm link"
  ];
  verify(t, flags, output);
});

test("symlink-dry-run 2 globals", function (t) {
  var flags = '-r . -d -g global1 -g global2';
  var output = [
    "test/module2 && npm link global1",
    "test/module2 && npm install external1 external2",
    "test/module2 && npm link",
    "test/module3 && npm link global2",
    "test/module3 && npm link module2",
    "test/module3 && npm link",
    "test/module1 && npm link module2 module3",
    "test/module1 && npm install external2",
    "test/module1 && npm link"
  ];
  verify(t, flags, output);
});

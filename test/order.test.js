var tap = require('tap')
  , test = tap.test
  , cp = require('child_process');

var expected = [
  'test/module2 && npm link',
  'test/module3 && npm link module2',
  'test/module3 && npm link',
  'test/module1 && npm link module2',
  'test/module1 && npm link module3',
  'test/module1 && npm link'
];

test("symlink-dry-run", function (t) {
  cp.exec('../symlink.js -r . -d', function (err, stdout, stderr) {
    if (err || stderr) {
      t.equal(err, null, "err executing");
      t.equal(stderr, null, "err executing");
    }
    else {
      t.ok(stdout, 'worked!');
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
});

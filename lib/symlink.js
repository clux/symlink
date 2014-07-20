var join = require('path').join
  , $ = require('interlude')
  , fs = require('fs');

module.exports = function (dir, globals, cb) {

  var deps = {}         // { module name -> [jsonDeps++jsonDevDeps] }
    , ownDeps = {}      // deps in names
    , foreignDeps = {}  // deps not in names
    , absPaths = {};    // { module name -> abs module path }

  var dirs = fs.readdirSync(dir).filter(function(str) {
    return fs.existsSync(join(dir, str, 'package.json'));
  });

  var names = dirs.map(function (m) {
    var json = require(join(dir, m, 'package.json'))
      , name = json.name
      , mDeps = $.extend(json.dependencies || {}, json.devDependencies || {});
    deps[name] = Object.keys(mDeps);
    absPaths[name] = join(dir, m);
    return name;
  });

  // partition dependencies
  Object.keys(deps).forEach(function (k) {
    ownDeps[k] = deps[k].filter($.elem(names));
    foreignDeps[k] = deps[k].filter($.notElem(names));
  });

  // sort deps in order of safe linking between each other
  var sorted = $.range(names.length).map(function () {
    var safe = $.firstBy(function (n) {
      // safe to link iff no local deps unlinked
      return !$.intersect(ownDeps[n], names).length;
    }, names);

    if (!safe) {
      // impossible to link a to b if b also tries to link to a without querying npm
      var err = "cannot link cyclically dependent: " + JSON.stringify(names);
      cb(new Error(err));
      return;
    }
    names.splice(names.indexOf(safe), 1); // remove it from names
    return safe;
  });

  var cmds = [];
  sorted.forEach(function (n) {
    // then find all commands required for each module in the found safe order
    var cd = 'cd ' + absPaths[n] + ' && ';

    // npm link in -g requested modules and internal deps when they are specified
    var linked = $.intersect(globals, foreignDeps[n]).concat(ownDeps[n]);
    if (linked.length > 0) {
      cmds.push(cd + 'npm link ' + linked.join(' '));
    }

    // npm install remaining deps
    var remaining = foreignDeps[n].filter($.notElem(linked));
    if (remaining.length > 0) {
      cmds.push(cd + 'npm install ' + remaining.join(' '));
    }

    // npm link (to make this available to the modules with more dependencies)
    cmds.push(cd + 'npm link');
  });

  cb(null, cmds);
};

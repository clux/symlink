var join = require('path').join
  , $ = require('interlude')
  , fs = require('fs')
  , async = require('async');

var getJson = function (pth, cb) {
  var pkgjson = join(pth, 'package.json');
  fs.exists(pkgjson, function (exists) {
    if (exists) {
      fs.readFile(pkgjson, function (err, data) {
        cb(err, err ? null : { path: pth, data: JSON.parse(data) });
      });
    }
    else {
      cb(null, null); // no error but no package.json
    }
  });
};

var getJsons = function (dir, cb) {
  fs.readdir(dir, function (err, data) {
    if (err) {
      return cb(err);
    }
    var paths = data.map(function (str) {
      return join(dir, str);
    });
    async.map(paths, getJson, cb);
  });
};

var getJsonsFromDirectories = function (dirs, cb) {
  async.map(dirs, getJsons, cb);
};

var analyze = function (deps, absPaths, globals, names) {
  var ownDeps = {}      // deps in names
    , foreignDeps = {}; // deps not in names

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
      throw new Error(err);
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
  return cmds;
};


module.exports = function (dirs, globals, cb) {
  var deps = {}         // { module name -> [jsonDeps++jsonDevDeps] }
    , absPaths = {};    // { module name -> abs module path }

  getJsonsFromDirectories(dirs, function (err, datas) {
    if (err) {
      return cb(err);
    }
    var names = datas.reduce(function (acc, data) {
      var namesCurr = data.filter(function (o) {
        return o !== null; // folders with package.json
      }).map(function (o) {
        var json = o.data;
        var name = json.name;
        var mDeps = $.extend(json.dependencies || {}, json.devDependencies || {});
        deps[name] = Object.keys(mDeps);
        absPaths[name] = o.path;
        return name;
      });
      return acc.concat(namesCurr);
    }, []);

    var cmds;
    try {
      cmds = analyze(deps, absPaths, globals, names);
    }
    catch (err) {
      return cb(err);
    }
    return cb(null, cmds);
  });
};

# Symlink [![Build Status](https://secure.travis-ci.org/clux/symlink.png)](http://travis-ci.org/clux/symlink)

- Have lots of personal node modules?
- `npm link` them all together?
- find the process of relinking everything after os install tedious?

If you answered YES to all the above, then this module is for you.
Otherwise, it is most certainly not.

## Usage
Install and run with paths to the modules you would like to link together:

```bash
$ npm install -g symlink
$ symlink module1/ module2/ ..
```

## WHAT DOES IT DO:

- reads the `package.json` of each module and finds their `dependencies` ++ `devDependencies`
- figures out which deps were given
- figures out which deps are external
- orders the modules so that linking can be in a safe order without having to query npmjs.org

Once everything has been ordered, a bunch of child processes are executed in series from the order of least inclusion;

- ownDeps[m].forEach (d) -> `npm link d`
- foreignDeps[m].forEach (d) -> `npm install d`
- `npm link`

I.e. link in all local dependencies, install the rest, then link it so the modules with more inclusions can safely link it in.

## TAP
If you'd like to link tap to all modules that have it specified in the package.json
specify a `-t` flag before listing module paths.

## License
MIT-Licensed. See LICENSE file for details.

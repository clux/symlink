# symlink(1)
Symlink `node` repositories together as quickly as possible.

## SYNOPSIS

`symlink [OPTION]... repoDir..`

## DESCRIPTION
Links together all repositories using `npm link` after having fetched the smallest amount of dependencies using `npm install`.

Performs dependency analysis to ensure the least dependent modules are made available via `npm link` first.

## OPTIONS

`-g,--global`    Globally installed module to be linked

`-e,--execute`    Execute commands - same as piping through `sh`

## EXAMPLES
See how a set of repositories would be linked together

`symlink repos`

Actually run the set of commands

`symlink repos | sh`

Reuse large globally installed modules if you know what you are doing

`symlink repos -g gulp`

## INSTALLATION
Install globally through npm

`npm install -g symlink`

## ALGORITHM
There is an analysis step:

- read `package.json` of each module in the given directory/directories and collects `dependencies` + `devDependencies`
- finds the `local` ones (found in given directories)
- finds the `external` ones (complement)
- orders the modules by least inclusion

Then the execution step for each module (by least inclusion):

- `npm link (localDeps) ∪ ((globals ∩ externalDeps))`
- `npm install (externalDeps ∖ globals)`
- `npm link`

This ensures your repository directories are all linked together.

## BUGS
Please report bugs [at](https://github.com/clux/symlink/issues)

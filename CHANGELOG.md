2.1.0 / 2015-11-16
=================
  * Add a man page
  * Add `.npmignore`

2.0.0 / 2015-03-28
=================
  * Dry run flag removed. Dry run is now the default.
  * Execute flag added `-e` or `--execute`.
  * Perform linking with either:
   1. `symlink repoDirs | sh`
   2. `symlink repoDirs --execute` (will log a little more)

1.1.0 / 2015-03-28
=================
  * Swap optimist for yargs and improve command line usage
  * Errors from child_process calls in CLI now result in non-zero return code

1.0.1 / 2015-03-28
==================
  * Errors from library use are now propagated correctly via callback

1.0.0 / 2015-03-26
==================
  * Allow multiple input directories to be listed before flags

0.3.0 / 2014-07-20
==================
  * `-r` flag is removed, now assumed the only unnamed argument
  * Rewrite so it can be used as a library:
    - package.json location is now fully asynchronous
    - library simply works out the commands like a -d dryrun
  * Unit test coverage

0.2.0 - 0.2.4 / 2013-10-07
==================
  * Add -g flag for global modules that can be linked in if present
  * Command output now perform multiple installs and links per line (shorter output)
  * Documentation improvements

0.1.1 / 2013-10-05
==================
  * Unit tests

0.1.0 / 2013-01-06
==================
  * Take a container directory rather than a bunch of sibling directories as input

0.0.3 / 2012-10-20
==================
  * documentation + code cleanup

0.0.1 / 2012-10-18
==================
  * initial release


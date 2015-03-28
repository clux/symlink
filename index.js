module.exports = process.env.SYMLINK_COV ?
  require('./lib-cov/symlink.js'):
  require('./lib/symlink.js');

module.exports.cli = process.env.SYMLINK_COV ?
  require('./lib-cov/cli.js'):
  require('./lib/cli.js');

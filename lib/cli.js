var Cli = require('commander');

var Package = require('../package');

module.exports = Cli
  .description('Generate a CHANGELOG.md file from github milestones and pull requests.')
  .version(Package.version)
  .option('-t, --token <token>', 'Github API personal access token')
  .option('-r, --repo <path>', 'The repo owner name and repo name')
  .option('-s, --start <date>', 'The initial date to start the report')
  .option('-b, --baselog <path>', 'Path and name of an existing CHANGELOG file')
  .option('-c, --classicoutput', 'Prints output to the console without using terminal-kit lib');
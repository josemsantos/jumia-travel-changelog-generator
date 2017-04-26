var shell = require('shelljs');

var yellow = "\033[1;33m";
var red = "\033[0;31m";
var green = "\033[0;32m";
var nc = "\033[0m";

module.exports = function output() {
    return {
        message: function (msg) {
            shell.echo(green + msg + nc + "\n");
        },
        warn: function (msg) {
            shell.echo(yellow + msg + nc + "\n");
        },
        error: function (msg) {
            shell.echo(red + "Error: " + msg + nc + "\n");
        }
    };
};
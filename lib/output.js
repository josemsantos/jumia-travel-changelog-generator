var terminal = require('terminal-kit').terminal;

module.exports = function output() {
    return {
        message: function(msg) {
            terminal.bold.green(msg + "\n");
        },
        warn: function(msg) {
            terminal.bold.yellow(msg + "\n");
        },
        error: function(msg) {
            terminal.bold.red("Error: " + msg + "\n");
        }
    };
};
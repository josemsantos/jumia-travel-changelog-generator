var json2md = require("json2md");
var writeFile = require('write');
var fs = require('fs');

module.exports = function writeChangeLog(ownerRepo) {
    var _data = false;
    var _baseLog = "";
    var _dataMap = [];
    var _issuesLabels = ["<strong>Improvements:</strong>", "<strong>Fixes:</strong>", "<strong>Others:</strong>"];

    json2md.converters.fullloglink = function (input, json2md) {
        return  "[Full Changelog](https://github.com/" + ownerRepo + "/compare/" + input.base + "..." + input.release + ")";
    };

    json2md.converters.release = function (input, json2md) {
        var _date;
        if (input.date) {
            _date = input.date.split('T')[0];
        } else {
            _date = "Future release";
        }
        
        return  "## [" + input.title + "]" + "(" + input.url + ")" + " (" + _date + ")";
    };

    json2md.converters.issue = function (input, json2md) {
        return  "- " + input.description + " [\#" + input.number + "](" + input.url + ") ([" + input.user.login + "](" + input.user.profile + "))";
    };

    function _mapData() {
        _dataMap.push({
            h1: "Changelog",
        });

        for (var i=0; i < _data.length; i++) {
            _dataMap.push({
                release: _data[i]
            });
            if (_data[i+1]) {
                _dataMap.push({
                    fullloglink: {
                        base: _data[i+1].title,
                        release: _data[i].title
                    }
                });
            }

            var _pos = -1;
            for (var j in _data[i].issues) {
                if (_data[i].issues[j].position > _pos) {
                    _pos = _data[i].issues[j].position;
                    _dataMap.push({
                        p: _issuesLabels[_pos]
                    });
                }
                _dataMap.push({
                    issue: _data[i].issues[j]
                });
            }
            _dataMap.push({
                p: '---'
            });
        }
    }
    function _writeFile(baseData) {
        writeFile('CHANGELOG.md', json2md(_dataMap) + baseData, function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
    return {
        setBaseLog: function(baseLog) {
            _baseLog = baseLog;
        },
        setData: function(releases) {
            _data = releases;
        },
        writeChangeLog: function() {
            _mapData();
            if (_baseLog) {
                fs.readFile(_baseLog, 'utf8', function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    _writeFile(data);
                });
            } else {
                _writeFile("");
            }
        }
    }
};
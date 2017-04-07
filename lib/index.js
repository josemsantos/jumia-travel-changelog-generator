#!/usr/bin/env node
var Datahandler = require('./data-handler');
var Client = require('./github-api-requests');
var Writer = require('./write-changelog');

function generateChangeLog(argv) {
    
    var client = new Client();
    client.setGithubToken(argv.token || argv.t);
    client.setOwnerRepo(argv.repo || argv.r);

    var dhandler = new Datahandler();

    var writer = new Writer(argv.repo || argv.r);
    writer.setBaseLog(argv.baselog || argv.b);

    var _start_date = argv.start || argv.s || "1970-01-01";
    _start_date = new Date(_start_date);
    if (!checkDate(_start_date)) {
        throw 'Invalid date ' + argv.start;
    }

    client.getMilestones().then(function(response){
        if (response.body.length) {
            Promise.all(
                response.body.map(function(milestone){
                    return getPrData(milestone);
                })
            ).then(values => {
                dhandler.sortReleasesIssuesByTypePosition();
                writer.setData(dhandler.getReleases());
                writer.writeChangeLog();
            }).catch(reason => { 
                console.log(reason)
            });
        }
    }).catch(function(err){
        console.log(err);
    });

    function checkDate(d) {
        if ( Object.prototype.toString.call(d) === "[object Date]" ) {
            if (isNaN(d.getTime())) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }
    function getPrData(milestone) {
        return new Promise(function(resolve, reject) {
            client.getPRInMilestone(milestone.title).then(function(response) {
                if (response.items.length) {
                    var _m = dhandler.toMileStone(milestone);
                    var _date = _m.date || _m.due_date;
                    if (_start_date.getTime() <= new Date(_date).getTime()) {
                        dhandler.addRelease(_m);
                        response.items.forEach(function(pr, i) {
                            dhandler.addIssue(dhandler.toIssue(pr));
                        });
                    }
                }
                resolve();
            }).catch(function(err) {
                console.log(err);
                rejected(err);
            });
        });
    }
}

module.exports = generateChangeLog;
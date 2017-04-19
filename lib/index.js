#!/usr/bin/env node
var Datahandler = require('./data-handler');
var Client = require('./github-api-requests');
var Writer = require('./write-changelog');
var Output = require('./output');

function generateChangeLog(argv) {

    var out = new Output();

    var client = new Client();
    client.setGithubToken(argv.token || argv.t);
    client.setOwnerRepo(argv.repo || argv.r);

    var dhandler = new Datahandler();

    var writer = new Writer(argv.repo || argv.r);
    writer.setBaseLog(argv.baselog || argv.b);

    var _start_date = argv.start || argv.s || "1970-01-01";
    _start_date = new Date(_start_date);
    if (!checkDate(_start_date)) {
        out.error('Invalid date ' + argv.start);
        return false;
    }

    client.getMilestones().then(function(response){
        var _nMstn = response.body.length;
        if (_nMstn) {
            out.message("Processing " + _nMstn + " Milestone" + ((_nMstn > 0) ? "s" : ""));
            Promise.all(
                response.body.map(function(milestone){
                    return getPrData(milestone);
                })
            ).then(values => {
                dhandler.sortReleasesIssuesByTypePosition();
                writer.setData(dhandler.getReleases());
                out.message("Writting changelog");
                writer.writeChangeLog().then(function(r) {
                    out.message("Finish with success");
                }).catch(function(err){
                    out.error(err);
                });
            }).catch(reason => { 
                out.error(reason);
            });
        }
    }).catch(function(err){
        out.error(err);
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
                var _nPr = response.items.length;
                out.message("Processing " + _nPr + " Pull requests in Milestone " + milestone.title);
                if (_nPr) {
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
                out.error(err);
                rejected(err);
            });
        });
    }
}

module.exports = generateChangeLog;
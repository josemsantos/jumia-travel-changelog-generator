#!/usr/bin/env node
var argv = require('yargs').argv;

var Datahandler = require('./data-handler');
var Client = require('./github-api-requests');
var Writer = require('./write-changelog');

function generateChangeLog() {

    var client = new Client();
    client.setGithubToken(argv.token || argv.t);
    client.setOwnerRepo(argv.repo || argv.r);

    var dhandler = new Datahandler();

    var writer = new Writer(argv.repo || argv.r);
    writer.setBaseLog(argv.baselog || argv.b);


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

    function getPrData(milestone) {
        return new Promise(function(resolve, reject) {
            client.getPRInMilestone(milestone.title).then(function(response) {
                if (response.items.length) {
                    dhandler.addRelease(dhandler.toMileStone(milestone));
                    response.items.forEach(function(pr, i) {
                        dhandler.addIssue(dhandler.toIssue(pr));
                    });
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
var needle = require('needle');

module.exports = function request() {
    var _api_end_point = "https://api.github.com/";
    //"06559423447a230947d9484cf29974fc3f890f76"
    //JovagoAIG/mobilix
    var _per_page = 100;
    var _options = {};
    var _owner_repo = "";

    return {
        setOwnerRepo: function(owner_repo) {
            _owner_repo = owner_repo;
        },
        setGithubToken: function(token) {
            _options.headers = { "Authorization": "token " + token }
        },
        getPRInMilestone: function(name) {
            return new Promise(function(resolve, reject) {
                
                var _request_uri = _api_end_point + "search/issues?q=milestone:" + name + "+type:pr+repo:" + _owner_repo + "&per_page=" + _per_page;
                needle.get(_request_uri, _options, function (err, response) {
                    if (null === err) {
                        resolve(response.body);
                    } else {
                        reject(err);
                    }
                });
            });
        },
        getMilestones: function(page) {
            return new Promise(function(resolve, reject) {
                page = page || 1;
                var _request_uri = _api_end_point + "repos/" + _owner_repo + "/milestones?state=all&spage=" + page + "&per_page=" + _per_page + "&sort=due_on";
                needle.get(_request_uri, _options, function (err, response) {
                    if (null === err) {
                        resolve({
                            link: response.headers.link,
                            body: response.body
                        });
                    } else {
                        reject(err);
                    }
                });
            });
        },
    }
};
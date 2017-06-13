module.exports = function dataHandler() {
    var _releases = [];
    var _orderingLabels = ['enhancement', 'bug'];
    function _getIssueTypePostion(labels) {
        for (var i in labels) {
            if (_orderingLabels.indexOf(labels[i].name) > -1) {
                return Number.parseInt(_orderingLabels.indexOf(labels[i].name));
            }
        }
        return _orderingLabels.length;
    }
    return {
        nextPageUri: function(linkHeader) {
            if (!linkHeader) {
                return false;
            }
            var links = linkHeader.split(',');
            var next = false;
            links.forEach(function(item, i) {
                if (item.indexOf('rel="next"') > -1) {
                    next = item.substring(item.indexOf('<') +1, item.indexOf('>'))
                }
            });
            return next;
        },
        toMileStone: function(milestone) {
            return {
                        title: milestone.title,
                        date: milestone.closed_at,
                        due_date: milestone.due_on,
                        url: milestone.html_url,
                        issues: []
                    };
        },
        toIssue: function(pr) {
            return {
                number: pr.number,
                url: pr.pull_request.html_url,
                description: pr.title,
                position: _getIssueTypePostion(pr.labels),
                user: {
                    login: pr.user.login,
                    profile: pr.user.url
                }
            };
        },
        addRelease: function(release) {
            _releases.push(release);
        },
        addIssue: function(issue) {
            if (_releases.length) {
                _releases[_releases.length-1].issues.push(issue);
            }
        },
        sortReleasesByDate: function() {
            if (_releases.length) {
                _releases = _releases.sort(function(a, b){
                    var _a = a.date || a.due_date || '2100-01-01';
                    var _b = b.date || b.due_date || '2100-01-01';
                    return new Date(_b) -  new Date(_a);
                });
                
                for (var i in _releases) {
                    this.sortIssuesByTypePosition(_releases[i]);
                }
            }
        },
        sortIssuesByTypePosition: function(release) {
            if (release.issues.length) {
                release.issues.sort(function(a, b){
                    return a.position - b.position;
                });
            }
        },
        getReleases: function() {
            return _releases;
        }
    }
};
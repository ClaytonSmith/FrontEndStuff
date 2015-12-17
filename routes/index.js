
/*
 * GET home page.
 */

var User    = require('../data/db/schema/users/schema');
var History = require('../data/db/schema/history/schema');

exports.index = function(req, res){
    res.render('index');
};

exports.partials = function (req, res) {
    var name = req.params.name;
    res.render('partials/' + name);
};

exports.userPage = function (req, res) {
    console.log(req.params.historyId);
    //    res.render('partials/link_history', {history: [1,2,3]});
    //    res.render('index');
    History.findById(req.params.historyId, function(err, history){
	if( err || !history ) res.render('partials/error');
	res.render('partials/link_history', history);
    });
};

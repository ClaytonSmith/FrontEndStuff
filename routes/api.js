/*
 * Serve JSON to our AngularJS client
 */

// remove

var User    = require('../data/db/schema/users/schema');
var History = require('../data/db/schema/history/schema');


exports.name = function (req, res) {
    res.send({
	name: 'test'
    });
};

exports.getUsers = function (req, res) {
    User.find({}, function(err, users){
	if (err) throw err;
	console.log('Users are being gotten');
	
	res.send(JSON.parse( JSON.stringify(users).replace(/\\\\u002e/g, '.')));
    });
}

exports.getUserHistory = function (req, res) {
    History.findById(req.body._id, function(err, history){
	console.log(err, history);
	res.send(history);
    });
}

exports.fileRecords = function (req, res) {
    console.log('Update req', req.body);
    req.body.users.forEach(function(coolUser){
	User.find( { $or: [
	    {steamId: coolUser.steamId}, 
	    {name: coolUser.name}
	]}, function(err, user){
	    
	    if( !!err ) {
		console.log(":(\n");
		console.log('WOWOOWOW', err);
		throw err;
	    }
	    
	    if( !user.length ){ 
		var newUser = new User({
		    name: coolUser.name
		});
		
		var newHistory = new History({
		    parentId: newUser._id
		});
		
		newHistory.insertRecords( coolUser.history );	
    		
		newUser.statistics =  newHistory.calcStats();
		newUser.historyId = newHistory._id;
		newUser.addAlias(newUser.name, newUser.steamId, newUser._id, newUser.historyId);
	   	
		newUser.save(function(err){ if (err) throw err; console.log('SAVED '+ coolUser.name ); });
		newHistory.save(function(err){ if (err) throw err; console.log('SAVED '+ coolUser.name +"'s history" ); });
		
	    } else {
		History.findById(user[0].historyId, function(err, history){
		    if (err) throw err;

		    console.log(err, history);
		    history.insertRecords( coolUser.history );
		    user[0].setStats( history.calcStats() );
		    
		    history.save();
		    user[0].save();
		    console.log('UPDATED ', coolUser.name );
		});
	    }
	});
    });
    // users   => [ {name: 'bla', <historyID: 12345>, <stats: {}> }, ... ]
    // history => { userID: 12345, [ {date: 1234567, links: []}, ... ] 
    // links   => [ {time: 1234567, user: 'name', link: 'www', <>}]

    /**
     * TODO: 
     * Find user is user collection
     * If user does not exist, add to collection
     *  -> create new history
     * add to history
     * Run stats methods
     * send socket update
     */

    /**
     * Stats: 
     * - Number of days on record
     * - Days since first log
     * - Average link per day
     * - Average link per conversation
     * - Activity measurements 
     * - Domain distribution
     * -- Favorite domains can be pulled from here. Top 3 maybe?
     */
}

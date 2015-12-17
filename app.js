
/**
 * Module dependencies
 */


var express      = require('express'),
  routes         = require('./routes'),
  api            = require('./routes/api'),
  http           = require('http'),
  path           = require('path'),
  livereload     = require('express-livereload');

var app          = module.exports = express();

var mongoose     = require('mongoose');

mongoose.connect('mongodb://localhost:27017/LinkHistory')

var User    = require('./data/db/schema/users/schema');
var History = require('./data/db/schema/history/schema');

var config = {
    watchDir: path.join(__dirname, '/views/')
};

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);


var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  app.use(express.errorHandler());
}

// production only
if (env === 'production') {
  // TODO
}

/**
 * Routes
 */

// serve index and view partials
app.get('/',                         routes.index);
app.get('/partials/link_history/:historyId', routes.userPage)
app.get('/partials/:name',           routes.partials);

// JSON API
app.get('/api/name',                 api.name);
app.get('/api/get_users',            api.getUsers)
app.get('/api/get_user_history',     api.getUserHistory);

app.post('/api/update_users',        api.fileRecords);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
livereload(app, config);


/*
require('./data/out.json').forEach(function(coolUser){
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
		
		console.log(err)
		history.insertRecords( coolUser.history );
		user[0].setStats( history.calcStats() );
		
		history.save();
		user[0].save();
		console.log('UPDATED ', coolUser.name );
	    });
	}
    });
});*/ 



//data.forEach(function(user){ 






/*
User.find({}, function(error, users){
    users.forEach(function(user){ 
	console.log(user.name);
	if( !user )
	    History.findById(user.historyId, function(err, history){
		if(err) throw err;
		if( history  === null ){
		    console.log( '****************************************************************************************** ', user.name);  
		} else {
		    user.setStats( history.calcStats() );
		    user.save(function(e){
			if(e) throw e;
			console.log('Saved ', user.name);
		    });
		}
	    });
    });
});*/

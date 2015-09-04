
/**
 * Module dependencies
 */

var express      = require('express'),
  routes         = require('./routes'),
  api            = require('./routes/api'),
  http           = require('http'),
  path           = require('path'),
  livereload     = require('express-livereload');


var mongo        = require('mongoskin')
var db           = mongo.db('mongodb://localhost:27017/LinkHistory')
var app          = module.exports = express();

var config = {
    watchDir: [
	path.join(__dirname, '/views'),
	path.join(__dirname, '/public/css/'),
    ]
};

//var db           = mongoose.connect('', {native_parser: true});

var userSchema   =
/**
 * Configuration
 */

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
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});


livereload(app, config);

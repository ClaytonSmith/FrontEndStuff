'user strict'


// History schema for node application using mongo and mongoose
// Clayton Smith

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;


var historySchema = new Schema({
    parentId: Schema.Types.ObjectId,
    dateAdded: { type: Number, default: Date.now },
    lastUpdated: { type: Number, default: Date.now },
    history: [
	{
	    date: Number,	    
	    links: [
		{
		    date: Number,
		    user: {type: String, 'default': ''},
		    url: String,
		    domain: { type: String, 'default': undefined }
		}
	    ] // TD
	}
    ]
},{collection: 'histories'});


function daysBetween(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24

    // Convert both dates to milliseconds
    var date1_ms = date1;
    var date2_ms = date2;

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms)

    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY)

}

function floorTimeToQuarter(time){

    time = new Date(time);
    time.setMilliseconds(Math.floor(time.getMilliseconds() / 1000) * 1000);
    time.setSeconds(Math.floor(time.getSeconds() / 60) * 60);
    time.setMinutes(Math.floor(time.getMinutes() / 15) * 15);
    return time.getHours() * 4 + (time.getMinutes() / 15);
}

function isExternal(url) {
    var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
    if (match != null && typeof match[1] === 'string' && match[1].length > 0 && match[1].toLowerCase() !== location.protocol)
        return true;

    if (match != null && typeof match[2] === 'string' && match[2].length > 0 && match[2].replace(new RegExp(':('+{'http:':80,'https:':443}[location.protocol]+')?$'), '') !== location.host) {
        return true;
    }
    else {
        return false;
    }
}

function getHostName(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    return (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) ? match[2] : null ;
}

function getDomain(url) {
    var hostName = getHostName(url);
    var domain = hostName;
    
    if (hostName != null) {
        var parts = hostName.split('.').reverse();
        
	if (parts != null && parts.length > 1) {
            domain = parts[1] + '.' + parts[0];
            
            if (hostName.toLowerCase().indexOf('.co.uk') != -1 && parts.length > 2) {
		domain = parts[2] + '.' + domain;
            }
	}
    }
    
    return domain ;
}

/****************************************************************************************/
// Run every night
historySchema.methods.calcStats = function(){
    var stats = {};
    
    stats.firstLogDate                = this.history.reduce(function(a,b){ return a.date < b.date ? a : b;}).date;
    stats.latestLinkSent              = this.history.reduce(function(a,b){ return a.date > b.date ? a : b;}).links.reduce(function(a,b){ return a.date > b.date ? a : b;});
    stats.daysSinceFirstLog           = daysBetween(stats.firstLogDate, Date.now());
    stats.daysLogged                  = this.history.length;
    stats.totalNumberOfLinks          = this.history.reduce(function(sum, record){return sum + record.links.length}, 0);
    stats.averageLinksPerDay          = stats.totalNumberOfLinks / stats.daysSinceFirstLog;
    stats.averageLinksPerConversation = stats.totalNumberOfLinks / stats.daysLogged;
    
    // Day broken down into 15 minute segments
    var DAY_15 = Array.apply(1, Array(24 * 4)).map(function(el){return 0;});
    
    stats.activityStats = Array.apply(1, Array(7)).map(function(el){return DAY_15;});
    stats.domainDistribution = {};
    
    this.history.forEach(function(record){
	record.links.forEach(function(link){
	    stats.activityStats[ (new Date(link.date)).getDay() ][ floorTimeToQuarter( new Date(link.date))] += 1;
	    stats.domainDistribution[ (link.domain || 'SOMETHING WENT WRONG').replace(/\./g, "\\u002e") ] = ( stats.domainDistribution[ link.domain ] || 0 ) + 1 ;
	});
    });    

    return stats; 
}

// Expect
historySchema.methods.insertRecords = function(records){
    // Merge records with matching dates 
    // Insert rest of records
    records.forEach(function(record){
	record.links.forEach(function(link){
	    link.domain = getDomain(link.url);
	});
    });
    
    var that = this;
    function doStuff(newRecord){
	var record = that.history.reduce(function(record, obj){
	    return obj.date === newRecord.date ? obj : record;
	}, undefined );
	
	if( !record ) return record
	
	record.links = record.links.concat( newRecord.links )
	
	return record
    }
    
    // returns record with matching date
    records.forEach(function(record){
	doStuff(record) ? null : that.history.push(record) ;
    });
}

// Update dates 
historySchema.pre('save', function(next) {

    // Sort links in records 
    this.history.forEach(function(record){
	record.links.sort(function(a,b){
	    return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
	});
    });

    this.lastUpdated = Date.now();

    next();
});

var History = mongoose.model('History', historySchema);
module.exports = History;


/**
* Schema
* 
* Methods
* - add
* - get stats 
* 
*/

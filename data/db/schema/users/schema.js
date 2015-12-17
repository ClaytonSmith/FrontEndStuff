'use strict'


// User schema for node application using mongo and mongoose
// Clayton Smith

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
    name: String,                             // User name as string
    dateAdded: { type: Number, 'default': Date.now },
    lastUpdated: { type: Number, 'default': Date.now },
    steamId: { type: String, 'default': null },
    knownAliases: {type: Array, 'default': []}, // List of knwow aliases, [{name: 'NAME', userId: MONGOId}, ..]
    historyId: Schema.Types.ObjectId,         // MongoId of history set
    statistics: { type: Object, 'default': {} } // Dictionary of stats 
}, {collection: 'users'});


// Add and delete aliases 

userSchema.methods.addAlias = function(name, steamId, mongoUserId, mongoHistoryId){
    this.knownAliases.push({
	name: name,
	steamId: steamId,
	mongoUserId: mongoUserId,
	mongoHistoryId: mongoHistoryId
    });
 
    return this.knownAliases;
}

userSchema.methods.deleteAliase = function(name, mongoId){
    this.knownAliases = this.knownAliases.filter(function(alias){return !(alias.name === name && alias.mongoId === mongoId) });
    return this.knownAliases;
}

// set stats, get stats 

userSchema.methods.setStats = function(stats){
    this.statistics = stats;
    return this.statistics;
} 

userSchema.methods.getStatistics = function(stats){
    return this.statistics;
} 

// Update dates 
userSchema.pre('save', function(next) {
    console.log('Pre save for', this.name);
    
    this.lastUpdated = Date.now();

    next();

    console.log('Done presave');
});

var User = mongoose.model('User', userSchema);
module.exports = User;

var request = require('request');

var CommandLineFuQuery = function(){
	this.url =	'http://www.commandlinefu.com/commands/';
	this.parameter = '';
	this.command  = 'browse';
	this.sort = 'votes';
	return this;
};

CommandLineFuQuery.prototype.browse = function(search){
	this.parameter = '';
	this.command = 'browse';
	return this;
};

CommandLineFuQuery.prototype.matching = function(search){
	this.parameter = search + '/' + new Buffer(search).toString('base64');
	this.command = 'matching';
	return this;
};

CommandLineFuQuery.prototype.sortBy = function(sort){
	this.sort = sort;
	return this;
}

CommandLineFuQuery.prototype.exec = function(callback){
	var url = this.url + this.command + '/';
	if(this.parameter){
		url = url + this.parameter + '/';
	}
	url = url + 'sort-by-' + this.sort + '/' + 'json';

	request({
		url: url,
		json: true
	}, callback);
};

module.exports = CommandLineFuQuery;
exports.displayBoard = function(req, res){
	var url = require('url');
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var gameInfo = {"away": query["away"], "home": query["home"], "date": query["date"]};
	res.render('board', { 'gameInfo': gameInfo });
};
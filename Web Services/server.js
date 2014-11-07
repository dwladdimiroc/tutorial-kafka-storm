var port = 8080;

//Winston Logger
var logger = require("./utils/logger");

//Configuration Express
var express = require('express')
  , app = module.exports = express()
  , cors = require('cors')
  , http = require('http')
  , server = http.createServer(app)
  , bodyParser = require('body-parser');
  server.listen(port);

var databaseUrl = "SDE"; //Name db MongoDB

//Usado para Routing
app.use("/function", express.static(__dirname + '/function'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/css/", express.static(__dirname + '/css/'));
app.use("/fonts/", express.static(__dirname + '/fonts/'));
app.use("/", express.static(__dirname + '/view/'));
app.use("/", express.static(__dirname + '/'));
//Usado para realizar el Post
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

logger.debug('Web Services Online in Port ' + port);

//Routing view
app.get('/', function(req, res){
	res.redirect("/view/index.html");
});

app.get('/home', function(req, res){
	res.redirect("/home.html");
});

//Devuelve el N tweet
app.get('/tweet/:number', function(req, res){
	var collec = ['userList'];
	var db = require("mongojs").connect(databaseUrl, collec);
	var collection = db.collection('userList');

	collection.count(function(error, numTweet) {
    	if(error) res.send('Error connection')
    	if(req.params.number >= numTweet){
    		res.send('Error length');
    	} else {
    		collection.find().skip(parseInt(req.params.number)).limit(1).toArray(function(e, results){
			    if (e) res.send('Error');
			    res.send('{"tweet":"'+results[0].tweet+'"}');
				db.close();
		  	})
    	}
	});
});

//Devuelve la cantidad de tweet que se poseen en la base de datos
app.get('/tweetCount/', function(req, res){
	//logger.debug('tweetClassifier');
	var collec = ['userList'];
	var db = require("mongojs").connect(databaseUrl, collec);
	var collection = db.collection('userList');

	collection.count(function(error, countTweet) {
    	if(error) res.send('Error connection');
    	//logger.debug(numTweet);
    	res.send('{"countTweet":"'+countTweet+'"}');
	});
});

//Devuelve la cantidad de votos que se poseen en la base de datos
app.get('/voteCount/', function(req, res){
	//logger.debug('tweetClassifier');
	var collec = ['countVote'];
	var db = require("mongojs").connect(databaseUrl, collec);
	var collection = db.collection('countVote');

	collection.find().sort( { _id: -1 } ).limit(1).toArray(function(error, results) {
    	if(error) res.send('Error connection');
    	//logger.debug(numTweet);
    	res.send('{"countVoteRed":"'+results[0].red+'","countVoteYellow":"'+results[0].yellow+'","countVoteBlue":"'+results[0].blue+'"}');
	});
});

//Guardar un tweet en base a un método POST
app.post('/login', function(req, res){
	logger.debug('Register Post');
	
	var collec = ['userList'];
	var db = require("mongojs").connect(databaseUrl, collec);
	var collection = db.collection('userList');

	var user = req.body.username;
	var pass = req.body.password;

	//logger.debug('The user ' + user + ' want to login with password ' + pass);

	//Login a la DB
    collection.find({username: user, password: pass}).toArray(function(error, results){
	    if (error) res.send('Error');

	    if (results.length > 0){
	    	logger.debug("Login correcto");
	    	res.send('{"status":"true"}');
	    } else {
	    	logger.debug("Login incorrecto");
    	    res.send('{"status":"false"}');
	    }
	    db.close();
	});
});

//Guardar un tweet en base a un método POST
app.post('/register', function(req, res){
	logger.debug('Register Post');
	
	var collec = ['userList'];
	var db = require("mongojs").connect(databaseUrl, collec);
	var collection = db.collection('userList');

	var user = req.body.username;
	var pass = req.body.password;

	//logger.debug('The user ' + user + ' want to register with password ' + pass);

	collection.find({username: user}).toArray(function(error, results){
	    if (error) res.send('Error');
	    if (results.length > 0){
	    	logger.debug("User existente");
	    	res.send('{"status":"false"}');
	    	db.close();
	    } else {
    	    db.userList.save({
	    		username: user,
	    		password: pass
		    	}, function(err, saved) {
				  if( err || !saved ){
				  	//logger.debug("saved "+saved);
				  	//logger.debug("err "+err);
				  	logger.debug("User don't register");
				  	res.send('Error');
				  } else {
				  	logger.debug("User register");
				  	//res.send('{"status":"true"}');
				  }
			});

			logger.debug('Vote register');
			var collecVote = ['voteList'];
			var dbVote = require("mongojs").connect(databaseUrl, collecVote);

			// Submit to the DB
		    dbVote.voteList.save(
		    	{
		    		username: user,
		    		vote: {yellow : 0, blue : 0, red : 0 }
		    	}, function(err, saved) {
				  if( err || !saved ){
				  	//logger.debug("saved "+saved);
				  	//logger.debug("err "+err);
				  	logger.debug("User don't vote");
				  	res.send('Error');
				  } else {
				  	logger.debug("Vote register");
				  	res.send('{"status":"true"}');
				  }
				  db.close();
			});
	    }
	});

	
});

//Guardar un tweet en base a un método POST
app.post('/vote', function(req, res){
	logger.debug('Vote Post');
	logger.debug(req.body.vote);
	
	var collec = ['voteList'];
	var db = require("mongojs").connect(databaseUrl, collec);

	var user = req.body.username;	
	var vote = JSON.parse(req.body.vote);
	var color = req.body.color;

	var log = {
		userLog: user,
		voteLog: color
	}

	logger.info(JSON.stringify(log));
	//logger.debug(vote);

	db.voteList.update(
    	{username: user},
    	{$inc: {"vote.yellow": vote.yellow,
    			"vote.blue": vote.blue,
    			"vote.red": vote.red}
    	}, function(err, updated) {
		  if( err || !updated ){
		  	logger.debug("User don't vote");
		  	res.send('{"status":"false"}');
		  } else {
		  	logger.debug("User vote");
		  	res.send('{"status":"true"}');
		  }
	});
});
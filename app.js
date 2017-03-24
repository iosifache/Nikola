/* Configuration file */
global.config = require('./config/config');

/* Functions */
function ensureAuthenticated(req, res, next){
    if (req.isAuthenticated()) return next()
    else res.redirect('/');
}
function ensureAdmin(req, res, next){
    if (req.user._json.email==config.adminEmail) return next()
    else res.redirect('/dashboard');
}
function IsJsonString(str){
    try{
        JSON.parse(str);
    }
	catch (e){
        return false;
    }
    return true;
}

/* Require NPM modules */
global.fs = require('fs');
global.express = require("express");
global.mongoose = require('mongoose');
global.passport = require('passport');
global.GithubStrategy = require('passport-github2').Strategy;
global.session = require('express-session');
global.bodyParser = require('body-parser');
global.cookieParser = require('cookie-parser');
global.methodOverride = require('method-override');
global.partials = require('express-partials');
global.cors = require('cors');
global.request = require('request');
global.helmet = require('helmet');

/* Database connect */
mongoose.connect(config.mongoUrl, function (err, res){
	if (err) console.log('Error connecting to database: ' + err)
    else console.log ('Succeeded connected to database');
});

/* Express framework init */
global.app = express();
global.cors_config = {
    origin: config.host,
    credentials: true
};
app.use(express.static('./public'));
app.use(cors(cors_config));
app.use(helmet());
app.set('views', './public/views');
app.set('view engine', 'pug');

/* Passport implement */
global.user = "";
passport.serializeUser(function(user, done){
  	done(null, user);
});
passport.deserializeUser(function(obj, done){
  	done(null, obj);
});
passport.use(new GithubStrategy({
        clientID: config.githubID,
        clientSecret: config.githubSecret,
        callbackURL: config.githubURL
    },
    function(accessToken, refreshToken, profile, done){
        process.nextTick(function(){
            return done(null, profile);
        });
    }
));
app.use(partials());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

/* Models */
var Schema = mongoose.Schema;
var indexSchema = new mongoose.Schema({
    brand: String,
    indexTitle: String,
    indexButton: String
}, {collection : 'data'});
var Index = mongoose.model('Index', indexSchema);
var dashboardSchema = new mongoose.Schema({
    brand: String,
    dashboardTitle: String,
	dashboardMenu1: String,
	dashboardMenu2: String,
	dashboardMenu3: String,
	dashboardLanguage: String,
	dashboardHour: String,
	dashboardOutside: String,
	dashboardPlatform: String,
	dashboardRecommand: String
}, {collection : 'data'});
var Dashboard = mongoose.model('Dashboard', dashboardSchema);
var problemSchema = new mongoose.Schema({
    problemTitle: String,
    problemDescription: String,
	problemInput: String,
	problemOutput: String,
	problemTutorial: String,
	problemTestsInput: String,
	problemTestsOutput: String
}, {collection : 'data'});
var Problem = mongoose.model('Problem', problemSchema);
var adminSchema = new mongoose.Schema({
	brand: String,
    indexTitle: String,
    indexButton: String,
	dashboardTitle: String,
	dashboardMenu1: String,
	dashboardMenu2: String,
	dashboardMenu3: String,
	dashboardLanguage: String,
	dashboardHour: String,
	dashboardOutside: String,
	dashboardPlatform: String,
	dashboardRecommand: String,
    problemTitle: String,
    problemDescription: String,
	problemInput: String,
	problemOutput: String,
	problemTutorial: String,
	problemTestsInput: String,
	problemTestsOutput: String,
	adminTitle: String,
	adminButtonHome: String,
	adminButtonDashboard: String,
	adminButtonLogout: String
}, {collection : 'data'});
var Admin = mongoose.model('Admin', adminSchema);

/* Controllers */
app.get('/auth/github', passport.authenticate('github', {scope: ['user:email']}), function(req, res){});
app.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/'}), function(req, res){
    res.redirect('/dashboard');
});
app.get('/logout', function(req, res){
  	req.logout();
  	res.redirect('/');
});
app.get('/', function(req, res){
    var IndexData;
    Index.find({}).exec(function(err, result){
        if (err) console.log(err)
        else{
            IndexData = result[0];
            res.render('index', {
                brand: IndexData.brand,
                title: IndexData.indexTitle,
                button: IndexData.indexButton
            });
        };
    });
});
app.get('/dashboard', ensureAuthenticated, function(req, res){
	var DashboardData;
	Dashboard.find({}).exec(function(err, result){
        if (err) console.log(err)
        else{
            DashboardData = result[0];
            res.render('dashboard', {
				brand: DashboardData.brand,
			    title: DashboardData.dashboardTitle,
				menu1: DashboardData.dashboardMenu1,
				menu2: DashboardData.dashboardMenu2,
				menu3: DashboardData.dashboardMenu3,
				language: DashboardData.dashboardLanguage,
				hour: DashboardData.dashboardHour,
				outside: DashboardData.dashboardOutside,
				platform: DashboardData.dashboardPlatform,
				recommand: DashboardData.dashboardRecommand,
				user: req.user
            });
			user = req.user;
        };
    });
});
app.get('/admin', ensureAuthenticated, ensureAdmin, function(req, res){
	var AdminData;
	Admin.find({}).exec(function(err, result){
		if (err) console.log(err)
		else{
			AdminData = result[0];
			res.render('admin', {
				brand: AdminData.brand,
				adminTitle: AdminData.adminTitle,
				adminButtonHome: AdminData.adminButtonHome,
				adminButtonDashboard: AdminData.adminButtonDashboard,
				adminButtonLogout: AdminData.adminButtonLogout
			});
		};
	});
});

/* Listen */
var server = app.listen(config.port, function (){
  console.log('App listening on port ' + config.port + '!');
});

/* Socket.io */
var io = require('socket.io')(server);
io.on('connection', function(client){
    console.log('Client connected..');
	client.on('compile', function(data){
		var code = data.code.split(' ').join('\t');
		request({
  			uri: "http://cloudcompiler.esy.es/api/submissions",
			method: "POST",
  			json: {
    			sourceCode: code,
				langId: data.id,
				stdin: data.in,
				timeLimit: 1
  			}
		}, function(error, response, body){
			if (IsJsonString(body)) id = JSON.parse(body).id
			else id = body.id;
  			var urlGET = "http://cloudcompiler.esy.es/api/submissions/" + id + "?withSource=1&withLang=1";
			setTimeout(function(){
				request({
		  			uri: urlGET,
					method: "GET"
				}, function(error, response, body){
					io.emit('compileResult', body);
				});
			}, 10000);
		});
	});
	client.on('getUser', function(data){
		io.emit('user', {"user": user});
	});
	client.on('getProblem', function(data){
		Problem.find({}).exec(function(err, result){
			if (err) console.log(err)
			else{
				ProblemData = result[0];
				var output = ProblemData.problemTestsInput;
				io.emit('problem', {
					"title": ProblemData.problemTitle,
					"description": ProblemData.problemDescription,
					"input": ProblemData.problemInput,
					"output": ProblemData.problemOutput,
					"tutorial": ProblemData.problemTutorial,
					"inputs": ProblemData.problemTestsInput
				});
				client.on('sendSolved', function(data){
					if (data.input==output) io.emit('results', {"results": 1});
					else io.emit('results', {"results": 0});
				});
			};
		});
	});
	client.on('getAdmin', function(data){
		Admin.find({}).exec(function(err, result){
	        if (err) console.log(err)
	        else{
	            AdminData = result[0];
	            io.emit('admin', {
					brand: AdminData.brand,
				    indexTitle: AdminData.indexTitle,
				    indexButton: AdminData.indexButton,
					dashboardTitle: AdminData.dashboardTitle,
					dashboardMenu1: AdminData.dashboardMenu1,
					dashboardMenu2: AdminData.dashboardMenu2,
					dashboardMenu3: AdminData.dashboardMenu3,
					dashboardLanguage: AdminData.dashboardLanguage,
					dashboardHour: AdminData.dashboardHour,
					dashboardOutside: AdminData.dashboardOutside,
					dashboardPlatform: AdminData.dashboardPlatform,
					dashboardRecommand: AdminData.dashboardRecommand,
				    problemTitle: AdminData.problemTitle,
				    problemDescription: AdminData.problemDescription,
					problemInput: AdminData.problemInput,
					problemOutput: AdminData.problemOutput,
					problemTutorial: AdminData.problemTutorial,
					problemTestsInput: AdminData.problemTestsInput,
					problemTestsOutput: AdminData.problemTestsOutput,
					adminTitle: AdminData.adminTitle,
					adminButtonHome: AdminData.adminButtonHome,
					adminButtonDashboard: AdminData.adminButtonDashboard,
					adminButtonLogout: AdminData.adminButtonLogout
	            });
	        };
	    });
	});
	client.on('update', function(data){
		Admin.find({}).exec(function(err, result){
			Admin.update(result, data, function(err, result){
				if (err) console.log(err)
			});
		});
	});
});

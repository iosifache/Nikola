/* Require server parts */
global.config = require('./server/config/config');
global.functions = require('./server/my_modules/functions');
global.middlewares = require('./server/my_modules/middlewares');

/* Require NPM modules */
global.fs = require('fs');
global.express = require("express");
global.mongo = require('mongodb').MongoClient;
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
mongo.connect(config.mongoUrl, function(err, db){
    if (err) console.log('Error connecting to database: ' + err)
    else{
        console.log ('Succeeded connected to database');
        global.db = db;
    }
});

/* Express.js framework initialization */
global.app = express();
global.cors_config = {
    origin: config.host,
    credentials: true
};
app.use(cors(cors_config));
app.use(helmet({
    frameguard: false
}))
app.use(express.static('./server/public'));
app.set('views', './server/public/views');
app.set('view engine', 'pug');

/* Passport.js authentication */
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
global.modelAdmin = require('./server/models/admin');
global.modelDashboard = require('./server/models/dashboard');
global.modelIndex = require('./server/models/index');
global.modelProblem = require('./server/models/problem');
global.modelUser = require('./server/models/user');

/* Controllers */
global.login = require('./server/controllers/login')(app);
global.index = require('./server/controllers/index')(app);
global.dashboard = require('./server/controllers/dashboard')(app);
global.admin = require('./server/controllers/admin')(app);

/* Listen */
global.server = app.listen(config.port, function(){
    console.log('App listening on port ' + config.port + '!');
});

/* Socket.io */
global.count = 0;
global.io = require('socket.io')(server);
io.on('connection', function(client){

    /* Global client */
    global.client = client;

    // Sockets
    global.socketDashboard = require('./server/sockets/dashboard')(client);
    global.socketAdmin = require('./server/sockets/admin')(client);

    // Auth middleware
    io.use(middlewares.socketAuth);

    // Count users
    count++;
    io.emit('message', {count: count});
    client.on('disconnect', function(){
        count--;
        io.emit('message', {count: count});
    })

});

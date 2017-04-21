module.exports = function(app){

    /* Route */
    app.get('/dashboard', middlewares.ensureAuthenticated, function(req, res){
        db.collection('data').find({}, modelDashboard.dashboardPageModel).toArray(function(err, results){
            if (err) console.log(err)
            else{
                res.render('dashboard', {
    				brand: results[0].brand,
    			    title: results[0].dashboardTitle,
    				menu1: results[0].dashboardMenu1,
    				menu2: results[0].dashboardMenu2,
    				menu3: results[0].dashboardMenu3,
    				language: results[0].dashboardLanguage,
    				hour: results[0].dashboardHour,
    				outside: results[0].dashboardOutside,
    				platform: results[0].dashboardPlatform,
    				recommand: results[0].dashboardRecommand,
    				user: req.user
                });
    			user = req.user;
            };
        });
    });

    /* Socket.io */
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
			if (functions.IsJsonString(body)) id = JSON.parse(body).id
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
        db.collection('problem').find({}, modelProblem.problemModel).toArray(function(err, results){
            if (err) console.log(err)
            else{
				var output = results[0].dailyTestsOutput;
				io.emit('problem', {
					"title": results[0].dailyTitle,
					"description": results[0].dailyDescription,
					"input": results[0].dailyInput,
					"output": results[0].dailyOutput,
					"tutorial": results[0].dailyTutorial,
					"inputs": results[0].dailyTestsInput
				});
				client.on('sendSolved', function(data){
					if (data.input==output) io.emit('results', {"results": 1});
					else io.emit('results', {"results": 0});
				});
            };
        });
	});
    
}

module.exports = function(client){
    client.on('getCompile', function(data){
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
                    io.emit('receiveCompile', body);
                });
            }, 10000);
        });
    });
    client.on('getUser', function(data){
        io.emit('receiveUser', {"user": user});
    });
    var output;
    client.on('getProblem', function(data){
        var email = user._json.email;
        db.collection('users').find({"email":email}, modelUser.userModel).toArray(function(err, results){
            if (err) console.log(err)
            else{
                db.collection('problem').find({"id":results[0].actual}, modelProblem.problemModel).toArray(function(err, results){
                    if (err) console.log(err)
                    else{
                        output = results[0].dailyTestsOutput;
                        io.emit('receiveProblem', {
                            "title": results[0].dailyTitle,
                            "description": results[0].dailyDescription,
                            "input": results[0].dailyInput,
                            "output": results[0].dailyOutput,
                            "tutorial": results[0].dailyTutorial,
                            "inputs": results[0].dailyTestsInput
                        });
                    };
                });
            };
        });
    });
    client.on('sendResults', function(data){
        if (data.input==output){
            db.collection('users').find({"email":user._json.email}, modelUser.userModel).toArray(function(err, resultsUser){
                if (err) console.log(err)
                else db.collection('problem').count({}, function(err, resultsCount){
                    var actual = resultsUser[0].actual;
                    var total = resultsCount;
                    if (actual<total){
                        db.collection('users').update({"email":user._json.email}, {$inc:{"actual": 1}});
                        io.emit('receiveResults', {"results": 1});
                    }
                    else io.emit('receiveResults', {"results": 2});
                });
            });
        }
        else io.emit('receiveResults', {"results": 0});
    });
};

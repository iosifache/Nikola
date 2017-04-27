module.exports = function(client){
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

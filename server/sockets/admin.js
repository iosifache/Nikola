module.exports = function(client){
    client.on('getAdmin', function(data){
        db.collection('data').find({}, modelAdmin.adminModel).toArray(function(err, resultsData){
            if (err) console.log(err)
            else{
                db.collection('problem').find({}, modelProblem.problemModel).toArray(function(err, resultsProblem){
                    if (err) console.log(err)
                    else{
                        db.collection('problem').count({}, function(err, resultsCount){
                            io.emit('receiveAdmin', {
                                brand: resultsData[0].brand,
                                indexTitle: resultsData[0].indexTitle,
                                indexButton: resultsData[0].indexButton,
                                dashboardTitle: resultsData[0].dashboardTitle,
                                dashboardMenu1: resultsData[0].dashboardMenu1,
                                dashboardMenu2: resultsData[0].dashboardMenu2,
                                dashboardMenu3: resultsData[0].dashboardMenu3,
                                dashboardLanguage: resultsData[0].dashboardLanguage,
                                dashboardHour: resultsData[0].dashboardHour,
                                dashboardOutside: resultsData[0].dashboardOutside,
                                dashboardPlatform: resultsData[0].dashboardPlatform,
                                dashboardRecommand: resultsData[0].dashboardRecommand,
                                dailyTitle: resultsProblem[0].dailyTitle,
                                dailyDescription: resultsProblem[0].dailyDescription,
                                dailyInput: resultsProblem[0].dailyInput,
                                dailyOutput: resultsProblem[0].dailyOutput,
                                dailyTutorial: resultsProblem[0].dailyTutorial,
                                dailyTestsInput: resultsProblem[0].dailyTestsInput,
                                dailyTestsOutput: resultsProblem[0].dailyTestsOutput,
                                adminTitle: resultsData[0].adminTitle,
                                adminButtonHome: resultsData[0].adminButtonHome,
                                adminButtonDashboard: resultsData[0].adminButtonDashboard,
                                adminButtonLogout: resultsData[0].adminButtonLogout,
                                count: resultsCount
                            });
                        });
                    };
                });
            };
        });
    });
    client.on('updateData', function(data){
        db.collection('data').update({}, {
            brand: data.brand,
            indexTitle: data.indexTitle,
            indexButton: data.indexButton,
            dashboardTitle: data.dashboardTitle,
            dashboardMenu1: data.dashboardMenu1,
            dashboardMenu2: data.dashboardMenu2,
            dashboardMenu3: data.dashboardMenu3,
            dashboardLanguage: data.dashboardLanguage,
            dashboardHour: data.dashboardHour,
            dashboardOutside: data.dashboardOutside,
            dashboardPlatform: data.dashboardPlatform,
            dashboardRecommand: data.dashboardRecommand,
            adminTitle: data.adminTitle,
            adminButtonHome: data.adminButtonHome,
            adminButtonDashboard: data.adminButtonDashboard,
            adminButtonLogout: data.adminButtonLogout
        }, function(err, results){
            if (err) console.log(err)
        });
    });
    client.on('updateProblem', function(data){
        db.collection('problem').update({"id":data.dailyID}, {
            id: data.dailyID,
            dailyTitle: data.dailyTitle,
            dailyDescription: data.dailyDescription,
            dailyInput: data.dailyInput,
            dailyOutput: data.dailyOutput,
            dailyTutorial: data.dailyTutorial,
            dailyTestsInput: data.dailyTestsInput,
            dailyTestsOutput: data.dailyTestsOutput
        }, function(err, results){
            if (err) console.log(err)
        });
    });
    client.on('addProblem',function(data){
        db.collection('problem').insert({
            id: data.dailyID,
            dailyTitle: data.dailyTitle,
            dailyDescription: data.dailyDescription,
            dailyInput: data.dailyInput,
            dailyOutput: data.dailyOutput,
            dailyTutorial: data.dailyTutorial,
            dailyTestsInput: data.dailyTestsInput,
            dailyTestsOutput: data.dailyTestsOutput
        }, function(err, results){
            if (err) console.log(err)
        });
    });
    client.on('searchUser', function(data){
        db.collection('users').find({"email": data.email}, modelUser.userModel).toArray(function(err, results){
            if (err) console.log(err)
            else{
                io.emit('searchResults', {
                    actual: results[0].actual
                });
            };
        });
    });
    client.on('getProblemById', function(data){
        db.collection('problem').find({"id": data.id}, modelProblem.problemModel).toArray(function(err, results){
            if (err) console.log(err)
            else{
                io.emit('receiveProblemById', {
                    "dailyTitle": results[0].dailyTitle,
                    "dailyDescription": results[0].dailyDescription,
                    "dailyInput": results[0].dailyInput,
                    "dailyOutput": results[0].dailyOutput,
                    "dailyTutorial": results[0].dailyTutorial,
                    "dailyTestsInput": results[0].dailyTestsInput,
                    "dailyTestsOutput": results[0].dailyTestsOutput
                });
            };
        });
    });
};

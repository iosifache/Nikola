/* Socket.io */
var socket = io();
socket.on('connect', function(data){
    socket.on('message', function(data){
        admin.userActive = "Utilizatori activi: " + data.count;
    });
});

/* Admin */
var admin = new Vue({
    el: '#form',
    data: {
        brand: "",
        indexTitle: "",
        indexButton: "",
        dashboardTitle: "",
        dashboardMenu1: "",
        dashboardMenu2: "",
        dashboardMenu3: "",
        dashboardLanguage: "",
        dashboardHour: "",
        dashboardOutside: "",
        dashboardPlatform: "",
        dashboardRecommand: "",
        dailyTitle: "",
        dailyDescription: "",
        dailyInput: "",
        dailyOutput: "",
        dailyTutorial: "",
        dailyTestsInput: "",
        dailyTestsOutput: "",
        adminTitle: "",
        adminButtonHome: "",
        adminButtonDashboard: "",
        adminButtonLogout: "",
        user: "",
        userActive: "",
        userNumber: "Problema actuala este:",
        contorProblem: 1,
        isDisableDown: 1,
        isDisableUp: 0,
        allProblems: 0
    },
    created: function(){
        socket.emit('getAdmin');
        socket.on('receiveAdmin', function(data){
            admin.brand=data.brand;
            admin.indexTitle=data.indexTitle;
            admin.indexButton=data.indexButton;
            admin.dashboardTitle=data.dashboardTitle;
            admin.dashboardMenu1=data.dashboardMenu1;
            admin.dashboardMenu2=data.dashboardMenu2;
            admin.dashboardMenu3=data.dashboardMenu3;
            admin.dashboardLanguage=data.dashboardLanguage;
            admin.dashboardHour=data.dashboardHour;
            admin.dashboardOutside=data.dashboardOutside;
            admin.dashboardPlatform=data.dashboardPlatform;
            admin.dashboardRecommand=data.dashboardRecommand;
            admin.dailyTitle=data.dailyTitle;
            admin.dailyDescription=data.dailyDescription;
            admin.dailyInput=data.dailyInput;
            admin.dailyOutput=data.dailyOutput;
            admin.dailyTutorial=data.dailyTutorial;
            admin.dailyTestsInput=data.dailyTestsInput;
            admin.dailyTestsOutput=data.dailyTestsOutput;
            admin.adminTitle=data.adminTitle;
            admin.adminButtonHome=data.adminButtonHome;
            admin.adminButtonDashboard=data.adminButtonDashboard;
            admin.adminButtonLogout=data.adminButtonLogout;
            admin.allProblems=data.count;
        });
    },
    methods: {
        updateData: function(){
            socket.emit('updateData', {
                "brand": admin.brand,
                "indexTitle": admin.indexTitle,
                "indexButton": admin.indexButton,
                "dashboardTitle": admin.dashboardTitle,
                "dashboardMenu1": admin.dashboardMenu1,
                "dashboardMenu2": admin.dashboardMenu2,
                "dashboardMenu3": admin.dashboardMenu3,
                "dashboardLanguage": admin.dashboardLanguage,
                "dashboardHour": admin.dashboardHour,
                "dashboardOutside": admin.dashboardOutside,
                "dashboardPlatform": admin.dashboardPlatform,
                "dashboardRecommand": admin.dashboardRecommand,
                "adminTitle": admin.adminTitle,
                "adminButtonHome": admin.adminButtonHome,
                "adminButtonDashboard": admin.adminButtonDashboard,
                "adminButtonLogout": admin.adminButtonLogout
            });
        },
        updateProblem: function(){
            if (admin.contorProblem<=admin.allProblems){
                socket.emit('updateProblem', {
                    "dailyID": admin.contorProblem,
                    "dailyTitle": admin.dailyTitle,
                    "dailyDescription": admin.dailyDescription,
                    "dailyInput": admin.dailyInput,
                    "dailyOutput": admin.dailyOutput,
                    "dailyTutorial": admin.dailyTutorial,
                    "dailyTestsInput": admin.dailyTestsInput,
                    "dailyTestsOutput": admin.dailyTestsOutput
                });
            }
            else{
                socket.emit('addProblem', {
                    "dailyID": admin.contorProblem,
                    "dailyTitle": admin.dailyTitle,
                    "dailyDescription": admin.dailyDescription,
                    "dailyInput": admin.dailyInput,
                    "dailyOutput": admin.dailyOutput,
                    "dailyTutorial": admin.dailyTutorial,
                    "dailyTestsInput": admin.dailyTestsInput,
                    "dailyTestsOutput": admin.dailyTestsOutput
                });
                admin.allProblems++;
                admin.isDisableUp=0;
            }
        },
        search: function(){
            socket.emit('searchUser', {"email": admin.user});
            socket.on('searchResults', function(data){
                admin.userNumber = "Problema actuala este: " + data.actual;
            });
        },
        down: function(){
            admin.contorProblem--;
            var incAllProblem = admin.allProblems + 1;
            if (admin.contorProblem==1) admin.isDisableDown=1
            else admin.isDisableDown=0;
            if (admin.contorProblem==incAllProblem) admin.isDisableUp=1
            else admin.isDisableUp=0;
            socket.emit('getProblemById', {"id": admin.contorProblem});
            socket.on('receiveProblemById', function(data){
                admin.dailyTitle=data.dailyTitle;
                admin.dailyDescription=data.dailyDescription;
                admin.dailyInput=data.dailyInput;
                admin.dailyOutput=data.dailyOutput;
                admin.dailyTutorial=data.dailyTutorial;
                admin.dailyTestsInput=data.dailyTestsInput;
                admin.dailyTestsOutput=data.dailyTestsOutput;
            });
        },
        up: function(){
            admin.contorProblem++;
            var incAllProblem = admin.allProblems + 1;
            if (admin.contorProblem==1) admin.isDisableDown=1
            else admin.isDisableDown=0;
            if (admin.contorProblem==incAllProblem) admin.isDisableUp=1
            else admin.isDisableUp=0;
            if (admin.contorProblem==incAllProblem){
                admin.dailyTitle="";
                admin.dailyDescription="";
                admin.dailyInput="";
                admin.dailyOutput="";
                admin.dailyTutorial="";
                admin.dailyTestsInput="";
                admin.dailyTestsOutput="";
            }
            else{
                socket.emit('getProblemById', {"id": admin.contorProblem});
                socket.on('receiveProblemById', function(data){
                    admin.dailyTitle=data.dailyTitle;
                    admin.dailyDescription=data.dailyDescription;
                    admin.dailyInput=data.dailyInput;
                    admin.dailyOutput=data.dailyOutput;
                    admin.dailyTutorial=data.dailyTutorial;
                    admin.dailyTestsInput=data.dailyTestsInput;
                    admin.dailyTestsOutput=data.dailyTestsOutput;
                });
            }
        }
    }
});

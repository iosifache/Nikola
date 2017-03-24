/* Socket.io */
var socket = io();
socket.on('connect', function(data){
    console.log("Connect to server with socket.io");
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
        problemTitle: "",
        problemDescription: "",
        problemInput: "",
        problemOutput: "",
        problemTutorial: "",
        problemTestsInput: "",
        problemTestsOutput: "",
        adminTitle: ""
    },
    created: function(){
        socket.emit('getAdmin');
        socket.on('admin', function(data){
            admin.brand=data.brand;
            admin.indexTitle=data.indexTitle,
            admin.indexButton=data.indexButton,
            admin.dashboardTitle=data.dashboardTitle,
            admin.dashboardMenu1=data.dashboardMenu1,
            admin.dashboardMenu2=data.dashboardMenu2,
            admin.dashboardMenu3=data.dashboardMenu3,
            admin.dashboardLanguage=data.dashboardLanguage,
            admin.dashboardHour=data.dashboardHour,
            admin.dashboardOutside=data.dashboardOutside,
            admin.dashboardPlatform=data.dashboardPlatform,
            admin.dashboardRecommand=data.dashboardRecommand,
            admin.problemTitle=data.problemTitle,
            admin.problemDescription=data.problemDescription,
            admin.problemInput=data.problemInput,
            admin.problemOutput=data.problemOutput,
            admin.problemTutorial=data.problemTutorial,
            admin.problemTestsInput=data.problemTestsInput,
            admin.problemTestsOutput=data.problemTestsOutput,
            admin.adminTitle=data.adminTitle
        });
    },
    methods: {
        update: function(){
            socket.emit('update', {
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
                "problemTitle": admin.problemTitle,
                "problemDescription": admin.problemDescription,
                "problemInput": admin.problemInput,
                "problemOutput": admin.problemOutput,
                "problemTutorial": admin.problemTutorial,
                "problemTestsInput": admin.problemTestsInput,
                "problemTestsOutput": admin.problemTestsOutput,
                "adminTitle": admin.adminTitle
            });
        }
    }
});

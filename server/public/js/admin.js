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
        adminButtonLogout: ""
    },
    created: function(){
        socket.emit('getAdmin');
        socket.on('admin', function(data){
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
            console.log(admin.dailyTitle);
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
                "dailyTitle": admin.dailyTitle,
                "dailyDescription": admin.dailyDescription,
                "dailyInput": admin.dailyInput,
                "dailyOutput": admin.dailyOutput,
                "dailyTutorial": admin.dailyTutorial,
                "dailyTestsInput": admin.dailyTestsInput,
                "dailyTestsOutput": admin.dailyTestsOutput,
                "adminTitle": admin.adminTitle,
                "adminButtonHome": admin.adminButtonHome,
                "adminButtonDashboard": admin.adminButtonDashboard,
                "adminButtonLogout": admin.adminButtonLogout
            });
        }
    }
});

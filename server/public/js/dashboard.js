/* Functions */
function timeNow(){
    var today = new Date();
    var hour = today.getHours();
    var minute = today.getMinutes();
    var second = today.getSeconds();
    if (minute < 10) minute = "0" + minute;
    if (second < 10) second = "0" + second;
    return {"hour": hour, "minute": minute, "second": second};
}
function timeFormat(time){
    var minute = parseInt((time/(1000*60))%60);
    var hour = parseInt((time/(1000*60*60))%24);
    if (minute < 10) {minute = "0" + minute};
    if (hour < 10) {hour = "0" + hour};
    return {"hour": hour, "minute": minute};
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

/* Ace editors initialization */
var editors = [
    {'id': 'editor', 'mode': 'sh', 'work': 'yes'},
    {'id': 'error', 'mode': 'plain_text', 'work': 'no'},
    {'id': 'in', 'mode': 'plain_text', 'work': 'no'},
    {'id': 'out', 'mode': 'plain_text', 'work': 'no'}
];
editors.forEach(function(element){
    var editor = ace.edit(element.id);
    editor.setTheme('ace/theme/monokai');
    editor.getSession().setMode('ace/mode/'+element.mode);
    if (element.work == "no") editor.getSession().setUseWorker(false);
    editor.setShowPrintMargin(false);
});

/* Socket.io */
var socket = io();

/* Languages */
var languagesList =[
    {"id":9,"name":"C","mode":"c_cpp"},
    {"id":11,"name":"C#","mode":"csharp"},
    {"id":15,"name":"C++14","mode":"c_cpp"},
    {"id":40,"name":"Java","mode":"java"},
    {"id":42,"name":"JavaScript","mode":"javascript"},
    {"id":55,"name":"Pascal","mode":"pascal"},
    {"id":57,"name":"Perl","mode":"perl"},
    {"id":59,"name":"PHP","mode":"php"},
    {"id":66,"name":"Python 3","mode":"python"},
    {"id":78,"name":"Swift","mode":"swift"}
]

/* Menu */
var menu = new Vue({
    el: '#menu',
    data: {
        languages: languagesList,
        counter: 0,
        language: languagesList[0],
        frame: "",
        compilation: ": ",
        solved: ": ",
        clock: "",
        lat: "",
        long: "",
        tutorial: "",
        weather:  "",
        enterHour: "",
        spendTime: "",
        recomandation: ""
    },
    created: function(){
        this.language = this.languages[this.counter].name;
        this.time();
        this.enterHour = new Date();
        this.getWeather();
        this.getSpendTime();
        Mousetrap.bind(['ctrl+s', 'command+s'], function(e){
            menu.save();
            return false;
        });
    },
    methods: {
        next: function(){
            var length = this.languages.length - 1;
            if(this.counter<length) this.counter++
            else this.counter = 0;
            this.language = this.languages[this.counter].name;
            var editor = ace.edit("editor");
            editor.getSession().setMode('ace/mode/' + this.languages[this.counter].mode);
            editor.getSession().setUseWorker(true);
        },
        prev: function(){
            var length = this.languages.length - 1;
            if(this.counter>0) this.counter--
            else this.counter = length;
            this.language = this.languages[this.counter].name;
            var editor = ace.edit("editor");
            editor.getSession().setMode('ace/mode/' + this.languages[this.counter].mode);
            editor.getSession().setUseWorker(true);
        },
        save: function(){
            var code = ace.edit("editor").getValue();
            var language = this.language;
            var name = "sursa" + language + ".txt";
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(code));
            element.setAttribute('download', name);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },
        white: function(){
            tutorial.tutorial = "Sugestiile de rezolvare sunt active doar daca tab-ul problemei este selectat";
            menu.frame = "";
            var editor = ace.edit("in");
            editor.setValue("");
            var editor = ace.edit("out");
            editor.setValue("");
            var editor = ace.edit("error");
            editor.setValue("");
        },
        problem: function(){
            socket.emit('getProblem');
            socket.on('receiveProblem', function(data){
                menu.frame = "<h1>Problema actuala</h1><p><b>Nume</b><span>: " + data.title + "</span></p><p><b>Descriere</b><span>: " + data.description + "</span></p><p><b>Date de intrare</b><span>: " + data.input + "</span></p><p><b>Date de iesire</b><span>: " + data.output + "</span></p>";
                var editor = ace.edit("in");
                editor.setValue(data.inputs, 1);
                tutorial.tutorial = data.tutorial;
                var editor = ace.edit("out");
                editor.setValue("");
                var editor = ace.edit("error");
                editor.setValue("");
            });
        },
        sendProblem: function(){
            var inData = ace.edit("out").getValue();
            socket.emit('sendResults', {"input": inData});
            socket.on('receiveResults', function(data){
                var editor = ace.edit("out");
                if (data.results=="2"){
                    editor.setValue("Solutia este valida, dar ai atins maximul de probleme. Te felicitam si asteptam peste ceva timp, dupa ce vom incarca mai multe probleme", 1);
                }
                if (data.results=="1"){
                    editor.setValue("Solutia este valida. Te felicitam si te asteptam la urmatoarea problema!", 1);
                    setTimeout(function(){
                        menu.problem();
                    }, 3000);
                }
                if (data.results=="0"){
                    editor.setValue("Ne pare rau, dar solutia ta nu este valida. Te rugam sa mai incerci!", 1);
                }
            });
        },
        settings: function(){
            socket.emit('getUser');
            socket.on('receiveUser', function(data){
                menu.frame = "<h1>Informatii</h1><p><b>Username</b><span>: " + data.user.username + "</p><p><b>URL</b><span>: <a href='" + data.user._json.html_url + "'>" + data.user._json.html_url + "</a></p><p><b>Nume</b><span>: " + data.user.displayName + "</p><p><b>Email</b><span>: " + data.user._json.email + "</p><p><b>Companie</b><span>: " + (data.user.company || "fara companie") + "</p><p><b>Blog</b><span>: " + (data.user.blog || "fara blog") + "</p><p><b>Domiciliu</b><span>: " + (data.user.location || "fara locatie") + "</p><p><b>Bio</b><span>: " + (data.user.bio || "fara bio") + "</p><p><b>Repo-uri publice</b><span>: " + data.user._json.public_repos + "</p><p><b>Gist-uri publice</b><span>: " + data.user._json.public_gists + "</p>";
                tutorial.tutorial = "Sugestiile de rezolvare sunt active doar daca tab-ul problemei este selectat";
                var editor = ace.edit("in");
                editor.setValue("");
                var editor = ace.edit("out");
                editor.setValue("");
                var editor = ace.edit("error");
                editor.setValue("");
            });
        },
        time: function(){
            var today = timeNow();
            this.clock = today.hour + ":" + today.minute + ":" + today.second;
            var timeout = setTimeout(this.time, 500);
        },
        getWeather: function(){
            this.$http.get('http://ip-api.com/json').then(response => {
                this.lat = response.body.lat;
                this.long = response.body.lon;
                this.$http.get("http://api.openweathermap.org/data/2.5/weather?lat=" + this.lat + "&lon=" + this.long + "&units=metric&appid=5f7bcf238dc7056a7325948af9cb61be").then(response => {
                    var temperature = response.body.main.temp;
                    var wind;
                    if (response.body.wind.speed<20) wind = "calm"
                    else if (response.body.wind.speed<40) wind = "moderat"
                    else wind = "puternic";
                    this.weather = Math.round(temperature) + " grade Celsius si vant " + wind;
                    var timeout = setTimeout(this.getWeather, 600000);
                });
            });
        },
        getSpendTime: function(){
            var today = new Date();
            var spend = this.enterHour;
            var result = timeFormat(today - spend);
            this.spendTime =  result.hour + ":" + result.minute + " pe platforma";
            if (result.hour<1) this.recomandation = "Fii productiv!"
            else this.recomandation = "Iti recomandam sa iei o pauza!";
            var timeout = setTimeout(this.getSpendTime, 1000);
        },
        compile: function(){
            var id = this.languages[this.counter].id;
            var code = ace.edit("editor").getValue();
            var inData = ace.edit("in").getValue();
            socket.emit('getCompile', {"id":id, "code": code, "in": inData});
            socket.on('receiveCompile', function(data){
                if (IsJsonString(data)) object = JSON.parse(data)
    			else object = data;
                var error = "";
                if (object.status<0) error += "Status: Se asteapta compilarea. Te rugam sa compilezi inca o data programul";
                if (object.status==0) error += "Status: Compilarea programului a fost executata cu succes";
                if (object.status==1) error += "Status: Se compileaza. Te rugam sa compilezi inca o data programul";
                if (object.status==3) error += "Status: Se executa. Te rugam sa compilezi inca o data programul";
                if (object.result==11) error += "\nRezultat: Eroare de compilare";
                if (object.result==12) error += "\nRezultat: Eroare tip runtime";
                if (object.result==13) error += "\nRezultat: Limita de timp depasita";
                if (object.result==15) error += "\nRezultat: Succes";
                if (object.result==17) error += "\nRezultat: Limita de spatiu depasita";
                if (object.result==19) error += "\nRezultat: Chemare ilegala a sistemului";
                if (object.result==20) error += "\nRezultat: Eroare interna";
                error +=  "\nTimp de executie: " + object.time + " secunde\nMemorie: " + object.memory+ " kilobytes";
                if (object.cmperr!="") error +=  "\n\nEroare de compilare: " + object.cmperr;
                else error +=  "\nEroare de compilare: " + object.cmperr;
                var editor = ace.edit("error");
                editor.setValue(error, 1);
                var editor = ace.edit("out");
                editor.setValue(object.stdout, 1);
            });
        }
    }
});

/* Tutorial */
var tutorial = new Vue({
    el: '#tutorial',
    data: {
        tutorial: "Sugestiile de rezolvare sunt active doar daca tab-ul problemei este selectat"
    }
});

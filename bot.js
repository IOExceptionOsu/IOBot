var DiscordClient = require("discord.io");
var mp3 = require("youtube-mp3");
var http = require('http');
var fs = require('fs');
var request = require("request");
var randomstring = require("randomstring");
var bot = new DiscordClient({
	email: "iobot@mailinator.com",
	password: process.env.PASSWORD,
	autorun: true
});

bot.on("ready", function() {
	console.log(bot.username + " - (" + bot.id + ")");
});

// >youtube https://www.youtube.com/watch?v=TcvnvNOtKo4

var queue = [ ];
var names = [ ];

var b0I={V:function(n,r,t){return n*r*t},D:function(n,r){return r>n},E:function(n,r){return n==r},B3:function(n,r){return n*r},G:function(n,r){return r>n},v3:function(n,r){return n*r},I3:function(n,r){return n in r},C:function(n,r){return n%r},R3:function(n,r){return n*r},O:function(n,r){return n%r},Z:function(n,r){return r>n},K:function(n,r){return n-r}};_sig=function(H){var U="R3",m3="round",e3="B3",D3="v3",N3="I3",g3="V",K3="toLowerCase",n3="substr",z3="Z",d3="C",P3="O",x3=["a","c","e","i","h","m","l","o","n","s","t","."],G3=[6,7,1,0,10,3,7,8,11,4,7,9,10,8,0,5,2],M=["a","c","b","e","d","g","m","-","s","o",".","p","3","r","u","t","v","y","n"],X=[[17,9,14,15,14,2,3,7,6,11,12,10,9,13,5],[11,6,4,1,9,18,16,10,0,11,11,8,11,9,15,10,1,9,6]],A={a:870,b:906,c:167,d:119,e:130,f:899,g:248,h:123,i:627,j:706,k:694,l:421,m:214,n:561,o:819,p:925,q:857,r:539,s:898,t:866,u:433,v:299,w:137,x:285,y:613,z:635,_:638,"&":639,"-":880,"/":687,"=":721},r3=["0","1","2","3","4","5","6","7","8","9"];gs=function(n,r){for(var t="D",u="",e=0;b0I[t](e,n.length);e++)u+=r[n[e]];return u},ew=function(n,r){var t="K",u="indexOf";return-1!==n[u](r,b0I[t](n.length,r.length))},gh=function(){var I=gs(G3,x3);return eval(I)},fn=function(n,r){for(var t="E",u="G",e=0;b0I[u](e,n.length);e++)if(b0I[t](n[e],r))return e;return-1};var L=[1.23413,1.51214,1.9141741,1.5123114,1.51214,1.2651],F=1;try{F=L[b0I[P3](1,2)];var W=gh(),S=gs(X[0],M),T=gs(X[1],M);F=ew(W,S)||ew(W,T)?L[1]:L[b0I[d3](5,3)]}catch(I){}for(var N=3219,Y=0;b0I[z3](Y,H.length);Y++){var Q=H[n3](Y,1)[K3]();fn(r3,Q)>-1?N+=b0I[g3](parseInt(Q),121,F):b0I[N3](Q,A)&&(N+=b0I[D3](A[Q],F)),N=b0I[e3](N,.1)}return N=Math[m3](b0I[U](N,1e3))};
sig=function(i){if("function"==typeof _sig){var r="X";try{r=_sig(i)}catch(n){}if("X"!=r)return r}return"-1"},sig_url=function(i){var r=sig(i);return i+"&s="+escape(r)};
var downloadMp3 = function(channelID, url, filename, callback) {
	console.log("DOWNLOADING");
	var time = process.hrtime();
	var timestamp = Math.round( time[ 0 ] * 1e3 + time[ 1 ] / 1e6 );
	var u1 = "http://www.youtube-mp3.org/a/pushItem/?item=" + escape(url) + "&el=na&bf=false&r=" + timestamp;
	u1 = sig_url(u1);
	console.log(u1);
	request(u1, function(error, response, body) {
		var id = body;
		time = process.hrtime();
		timestamp = Math.round( time[ 0 ] * 1e3 + time[ 1 ] / 1e6 );
		var u2 = "http://www.youtube-mp3.org/a/itemInfo/?video_id=" + id + "&ac=www&t=grp&r=" + timestamp;
		u2 = sig_url(u2);
		console.log(u2);
		request(u2, function(error2, response2, body2) {
			var info = JSON.parse(body2.replace("info = ", "").replace("};", "}"));
			console.log(info);
			bot.sendMessage({ to: channelID, message: "Downloading " + info["title"] + "..." });
			var file = fs.createWriteStream(filename);
			var u3 = "http://www.youtube-mp3.org/get?video_id=" + id + "&ts_create=" + info["ts_create"] + "&r=" + encodeURIComponent(info["r"]) + "&h2=" + info["h2"];
			u3 = sig_url(u3);
			file.on("close", function() {
				console.log("Done downloading to " + filename);
				bot.sendMessage({ to: channelID, message: "Done downloading to " + filename });
				queue.push(filename);
				names.push(info["title"]);
				callback();
			});
			request(u3).pipe(file); 
		});
	});
}

var chan;
var currentSong;

bot.on("message", function(user, userID, channelID, message, rawEvent) {
	console.log(user + " (" + userID + ") #" + channelID + ": " + message);
	if (message.startsWith(">")) {
		var command = message.substring(1).toLowerCase().split(" ")[0];
		switch(command) {
			case "join":
				join(channelID, message);
				break;
			case "help":
				bot.sendMessage({ to: channelID, message: "Available commands are: help, youtube." });
				break;
			case "youtube":
				var url = message.substring(8).trim();
				console.log(url);
				if (url.length < 1) {
					bot.sendMessage({ to: channelID, message: "GIVE ME A GODDAMN URL TO PLAY FROM `>youtube http://youtube.com/whatever`" });
					break;
				}
				if (!(url.toLowerCase().indexOf("youtube.com") >= 0 || url.toLowerCase().indexOf("youtu.be") >= 0)) {
					bot.sendMessage({ to: channelID, message: "HOW THE F DO YOU EXPECT ME TO PLAY THIS" });
					break;
				}
				/* mp3.download(url, "downloads/" + randomstring.generate(15), function(err) {
					if(err) return console.dir(err);
					console.log('Download completed!');
				});*/
				downloadMp3(channelID, url, "downloads/" + randomstring.generate(15) + ".mp3", function() {
					playQueue();
				});
				/* bot.testAudio({ channel: channelID , stereo: true }, function(stream) {
					console.log(stream);
				});*/
				break;
			default:
				bot.sendMessage({ to: channelID, message: "Hey there! I'm the computer version of IOException. Type `>help` to see what I can do!" });
				break;
		}
	}
});

function join(channelID, message){
	var channel = message.substring(message.indexOf(" ") + 1);
	var server = bot.serverFromChannel(channelID);
	var channels = bot.servers[server].channels;

	Object.keys(channels).forEach(function(key) {
		if(channels[key].name === channel){
			bot.joinVoiceChannel(channels[key].id, function(){
				console.log("joined");
				chan = channels[key].id;
			});
		}
	});
}

var playQueue = function() {
	var stopped = false;
	bot.testAudio({ channel: chan , stereo: true }, function(stream) {
		if(queue.length > 0){
			var temp = queue.shift();
			currentSong = names.shift();
			stream.playAudioFile(temp);
			console.log(currentSong + " is now playing");
		} else {
		}	
		stream.once("fileEnd",function(){
			if(!stopped){
				setTimeout(function(){
					playQueue();
				}, 2000);
			}
		});
	});
};
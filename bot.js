var DiscordClient = require("discord.io");
var mp3 = require("youtube-mp3");
var http = require("http");
var async = require("async");
var fs = require("fs");
var queue_async = require("queue-async");
const low = require("lowdb");
var Cleverbot = require("cleverbot.io");
const storage = require("lowdb/file-sync");
var request = require("request");
var randomstring = require("randomstring");
var YouTube = require("youtube-node");

var youTube = new YouTube();
youTube.setKey(process.env.YOUTUBE_APIKEY);
var cleverbot = new Cleverbot(process.env.CLEVERBOT_APIUSER, process.env.CLEVERBOT_APIKEY);
cleverbot.setNick("IOBot");
const db = low('db.json', { storage: storage });
var bot = new DiscordClient({
	email: "iobot@mailinator.com",
	password: process.env.PASSWORD,
	autorun: true
});

bot.on("ready", function() {
	console.log(bot.username + " - (" + bot.id + ")");
	exeQueuete();
});

// >youtube https://www.youtube.com/watch?v=TcvnvNOtKo4

// var queue = (function q(){var n,r,t,u;return u=function(v){return v!=t?(r=r?r.n={v:v}:n={v:v},v=u):(v=n?n.v:t,n=n==r?r=t:n.n),v}})();
var queue = [ ];
var queueFile = "queue.dat";

try {
	var queueFileStats = fs.statSync(queueFile);
	if (queueFileStats.isFile()) {
		queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
	}
} catch (e) { }

try {
	var downloadsFolderStats = fs.statSync("downloads");
	if (!downloadsFolderStats.isFolder()) {
		fs.mkdirSync("downloads");
	}
} catch (e) { }

var stopped = false;
var cleanup_and_exit = function() {
	stopped = true;
	console.log("SHUTTING DOWN");
	console.log(queue);
	fs.writeFileSync(queueFile, JSON.stringify(queue));
    setTimeout(function() {
        process.exit(1);
    }, 1000);
};
process.on("SIGINT", cleanup_and_exit);
process.on("SIGTERM", cleanup_and_exit);

var b0I={V:function(n,r,t){return n*r*t},D:function(n,r){return r>n},E:function(n,r){return n==r},B3:function(n,r){return n*r},G:function(n,r){return r>n},v3:function(n,r){return n*r},I3:function(n,r){return n in r},C:function(n,r){return n%r},R3:function(n,r){return n*r},O:function(n,r){return n%r},Z:function(n,r){return r>n},K:function(n,r){return n-r}};_sig=function(H){var U="R3",m3="round",e3="B3",D3="v3",N3="I3",g3="V",K3="toLowerCase",n3="substr",z3="Z",d3="C",P3="O",x3=["a","c","e","i","h","m","l","o","n","s","t","."],G3=[6,7,1,0,10,3,7,8,11,4,7,9,10,8,0,5,2],M=["a","c","b","e","d","g","m","-","s","o",".","p","3","r","u","t","v","y","n"],X=[[17,9,14,15,14,2,3,7,6,11,12,10,9,13,5],[11,6,4,1,9,18,16,10,0,11,11,8,11,9,15,10,1,9,6]],A={a:870,b:906,c:167,d:119,e:130,f:899,g:248,h:123,i:627,j:706,k:694,l:421,m:214,n:561,o:819,p:925,q:857,r:539,s:898,t:866,u:433,v:299,w:137,x:285,y:613,z:635,_:638,"&":639,"-":880,"/":687,"=":721},r3=["0","1","2","3","4","5","6","7","8","9"];gs=function(n,r){for(var t="D",u="",e=0;b0I[t](e,n.length);e++)u+=r[n[e]];return u},ew=function(n,r){var t="K",u="indexOf";return-1!==n[u](r,b0I[t](n.length,r.length))},gh=function(){var I=gs(G3,x3);return eval(I)},fn=function(n,r){for(var t="E",u="G",e=0;b0I[u](e,n.length);e++)if(b0I[t](n[e],r))return e;return-1};var L=[1.23413,1.51214,1.9141741,1.5123114,1.51214,1.2651],F=1;try{F=L[b0I[P3](1,2)];var W=gh(),S=gs(X[0],M),T=gs(X[1],M);F=ew(W,S)||ew(W,T)?L[1]:L[b0I[d3](5,3)]}catch(I){}for(var N=3219,Y=0;b0I[z3](Y,H.length);Y++){var Q=H[n3](Y,1)[K3]();fn(r3,Q)>-1?N+=b0I[g3](parseInt(Q),121,F):b0I[N3](Q,A)&&(N+=b0I[D3](A[Q],F)),N=b0I[e3](N,.1)}return N=Math[m3](b0I[U](N,1e3))};
sig=function(i){if("function"==typeof _sig){var r="X";try{r=_sig(i)}catch(n){}if("X"!=r)return r}return"-1"},sig_url=function(i){var r=sig(i);return i+"&s="+escape(r)};
var downloadMp3 = function(url, filename, callback) {
	try {
		console.log("DOWNLOADING");
		var time = process.hrtime();
		var timestamp = Math.round( time[ 0 ] * 1e3 + time[ 1 ] / 1e6 );
		var u1 = "http://www.youtube-mp3.org/a/pushItem/?item=" + escape(url) + "&el=na&bf=false&r=" + timestamp;
		u1 = sig_url(u1);
		console.log("URL(1): " + u1);
		request(u1, function(error, response, body) {
			var id = body;
			time = process.hrtime();
			timestamp = Math.round( time[ 0 ] * 1e3 + time[ 1 ] / 1e6 );
			var u2 = "http://www.youtube-mp3.org/a/itemInfo/?video_id=" + id + "&ac=www&t=grp&r=" + timestamp;
			u2 = sig_url(u2);
			console.log("URL(2): " + u2);
			request(u2, function(error2, response2, body2) {
				if (body2.indexOf("undefined") >= 0 || body2.indexOf("ERROR") >= 0) {
					console.log(error2 + "\t" + JSON.stringify(response2));
					callback("failed");
				} else {
					var info = JSON.parse(body2.replace("info = ", "").replace("};", "}"));
					// console.log(info);
					var file = fs.createWriteStream(filename);
					var u3 = "http://www.youtube-mp3.org/get?video_id=" + id + "&ts_create=" + info["ts_create"] + "&r=" + encodeURIComponent(info["r"]) + "&h2=" + info["h2"];
					u3 = sig_url(u3);
					console.log("URL(3): " + u3);
					file.on("close", function() {
						console.log("Done downloading to " + filename);
						// queue.push(filename);
						// names.push(info["title"]);
						var image = info["image"];
						var imageFile = "downloads/" + randomstring.generate(15) + ".jpg";
						var file2 = fs.createWriteStream(imageFile);
						info["imageFile"] = imageFile;
						file2.on("close", function() {
							callback(info);
						});
						request(image).pipe(file2);
					});
					request(u3).pipe(file); 
				}
			});
		});
	} catch (e) {
		console.log(e);
		console.log("something fucked up");
		callback("failed");
	}
}

var chan;
var currentSong;
var prevChannel;
var lastSearch;

function get_id_from_url(url){
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
	var match = url.match(regExp);
	return (match&&match[7].length==11)? match[7] : false;
}

var add_url_to_queue = function(url) {
	var id = get_id_from_url(url);
	request("https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&key=" + process.env.YOUTUBE_APIKEY + "&id=" + id, function(error, response, body) {
		var result = JSON.parse(body)["items"][0];
		var title = result["snippet"]["title"];
		if (result == undefined) {
			title = url;
		}
		queue.push({
			url: url,
			votes: [ ],
			title: title,
			timeAdded: new Date().getTime()
		});
	});
};

bot.on("message", function(user, userID, channelID, message, rawEvent) {
	var show_queue = function() {
		if (queue.length == 0) {
			return bot.sendMessage({ to: channelID, message: "There are no songs in the queue!" });
		}
		bot.sendMessage({ to: channelID, message: "The songs in the queue:" }, function() {
			var currentQueue = JSON.parse(JSON.stringify(queue));
			(function next(i) {
				if (i == currentQueue.length) {
					// bot.sendMessage({ to: channelID, message: "" });
					return;
				}
				bot.sendMessage({ to: channelID, message: " [" + (i + 1) + "]\t" + currentQueue[i]["title"] + "\t(" + currentQueue[i]["votes"].length + " votes)" }, function() {
					next(i + 1);
				});
			})(0);
		});
	}
	console.log(user + " (" + userID + ") #" + channelID + ": " + message);
	if (message.startsWith(">")) {
		prevChannel = channelID;
		var command = message.substring(1).toLowerCase().split(" ")[0];
		switch(command) {
			case "join":
				join(channelID, message);
				break;
			case "help":
				bot.sendMessage({ to: channelID, message: "Available commands are: help, playsearch, skipsong, youtube, ytsearch." });
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
				add_url_to_queue(url);
				bot.sendMessage({ to: channelID, message: "That video has been queued!" });
				break;
			case "ytsearch":
				var query = message.substring(9).trim();
				youTube.search(query, 10, function(error, result) {
					if (error) { return console.log(error); }
					var searchItems = [ ];
					var i = 0;
					bot.sendMessage({ to: channelID, message: "Results for '" + query + "' (" + result["pageInfo"]["totalResults"] + "):" }, function() {
						(function next(i) {
							if (i == Math.min(result["pageInfo"]["totalResults"], 10)) {
								lastSearch = searchItems;
								bot.sendMessage({ to: channelID, message: "To play one of the above videos, type `>playsearch <number>`" });
								return;
							}
							var item = result["items"][i];
							var obj = {
								url: "https://youtu.be/" + item["id"]["videoId"],
								title: item["snippet"]["title"]
							}; 
							searchItems.push(obj);
							bot.sendMessage({ to: channelID, message: " [" + i + "]\t" + obj["title"] }, function() {
								next(i + 1);
							});
						})(0);
					});
				});
				break;
			case "playsearch":
				try {
					var N = parseInt(message.substring(11).trim());
					if (N >= 0 && N < 10) {
						console.log(lastSearch[N]);
						add_url_to_queue(lastSearch[N]["url"]);
						bot.sendMessage({ to: channelID, message: "'" + lastSearch[N]["title"] + "' has been queued!" });
					} else {
						throw Error();
					}
				} catch (e) {
					bot.sendMessage({ to: channelID, message: "GIVE ME A GODDAMN NUMBER TO PLAY!" });
				}
				break;
			case "showqueue":
				show_queue();
				break;
			case "vote":
				try {
					var N = parseInt(message.substring(5).trim());
					if (N > 0 && N <= queue.length) {
						N -= 1;
						if (queue[N]["votes"].indexOf(user) >= 0) {
							throw Error("YOU ALREADY VOTED FOR THIS");
						} else {
							queue[N]["votes"].push(user);
							bot.sendMessage({ to: channelID, message: "Vote sent. Current voters: " + queue[N].votes.join(", ") });
							sort_queue();
							show_queue();
						}
					} else {
						throw Error("CHOOSE A GODDAMN NUMBER IN THE LIST");
					}
				} catch(e) {
					bot.sendMessage({ to: channelID, message: e.toString() });
				}
				break;
			case "skipsong":
				if (chan) {
					var _chan = chan.substring(0);
					bot.leaveVoiceChannel(chan, function() {
						bot.joinVoiceChannel(_chan);
					});
				}
				break;
			case "clearqueue":
				queue = [ ];
				break;
			case "cleverbot":
			case "cb":
				var query = message.substring(command.length + 1);
				cleverbot.create(function (err, session) {
					cleverbot.ask(query, function (err, response) {
						bot.sendMessage({ to: channelID, message: "@" });
					});
				});
				break;
			default:
				bot.sendMessage({ to: channelID, message: "Hey there! I'm the computer version of IOException. Type `>help` to see what I can do!" });
				break;
		}
	} else {
	}
});

function join(channelID, message) {
	var channel = message.substring(message.indexOf(" ") + 1);
	var server = bot.serverFromChannel(channelID);
	var channels = bot.servers[server].channels;

	Object.keys(channels).forEach(function(key) {
		if(channels[key].name === channel){
			if (chan) {
				if (channels[key].id != chan) {
					bot.leaveVoiceChannel(chan);
				} else {
					return;
				}
			}
			bot.joinVoiceChannel(channels[key].id, function(){
				console.log("joined" + channels[key].id);
				chan = channels[key].id;
			});
		}
	});
}

/* var playQueue = function() {
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
}; */

var clean_downloads_folder = function() {
	var files = fs.readdirSync("downloads").reduce(function(list, file) { return list.concat([ file ]); }, []);
	var num = files.length;
	if (num > 30) {
		for(var i=0; i<files.length; i++) {
			db("songs").remove({ file: "donwloads/" + files[i] });
			fs.unlinkSync("downloads/" + files[i]);
		}
	}
};

var sort_queue = function() {
	queue.sort(function(a, b) {
		if (a["votes"] == b["votes"]) return a["timestamp"] - b["timestamp"];
		return -(a["votes"].length - b["votes"].length);
	});
};

var exeQueuete = function() {
	if (!(chan && chan.length >= 0)) {
		console.log("No voice channel.");
		if (!stopped) {
			setTimeout(function() {
				exeQueuete();
			}, 2000);
		}
	} else {
		try {
			clean_downloads_folder();
			sort_queue();
			console.log("Checking the queue...");
			console.log(queue.length == 0 ? "Nothing there!" : "Found a URL!")
			if (queue.length != 0) {
				var next = queue.shift();
				var url = next["url"];
				if (url == undefined) {
					return exeQueuete();
				}
				console.log("url: " + url);
				(function(callback) {
					var entry = db("songs").find({ url: url });
					if (entry == undefined) {
						var filename = "downloads/" + randomstring.generate(15) + ".mp3";
						downloadMp3(url, filename, function(info) {
							if (info === "failed") { return exeQueuete(); }
							entry = {
								url: url,
								file: filename,
								meta: info
							};
							db("songs").push(entry);
							callback(entry);
						});
					} else {
						callback(entry);
					}
				})(function(entry) {
					bot.sendMessage({ to: prevChannel, message: "Now playing: " + next["title"] });
					bot.uploadFile({ channel: prevChannel, file: fs.createReadStream(entry["meta"]["imageFile"]) });
					console.log(entry["file"]);
					try {
						bot.testAudio({ channel: chan , stereo: true }, function(stream) {
							stream.once("fileEnd", function() {
								if (!stopped) {
									setTimeout(function() {
										exeQueuete();
									}, 2000);
								}
							});
							stream.playAudioFile(entry["file"]);
						});
					} catch (e) {
						if (!stopped) {
							setTimeout(function() {
								exeQueuete();
							}, 2000);
						}
					}
				});
			} else {
				// wait 2 seconds and try again
				if (!stopped) {
					setTimeout(function() {
						exeQueuete();
					}, 2000);
				}
			}
		} catch(e) {
			console.log("SOMETHING FUCKED UP");
			console.log(e);
			if (!stopped) {
				setTimeout(function() {
					exeQueuete();
				}, 2000);
			}
		}
	}
};
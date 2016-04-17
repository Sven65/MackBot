var helper = require("../util/Helper.js");
var fs = require("fs");
var request = require("request");
var settings = require("../settings.json");
var profiles = require("../data/profiles.json");

var blacklist = ["http://i.giphy.com/12CvxNY8J5utEs.gif"];

String.prototype.capFirst = function(){
    return this.charAt(0).toUpperCase() + this.slice(1);
};

var profile = {
	"profile": {
		process: function(args, message, bot){
			var user = message.author.id;
			var name = message.author.name;
			var pic = message.author.avatarURL;
			if(message.mentions.length > 0){
				if(message.mentions[0].id != bot.user.id){
					user = message.mentions[0].id;
					name = message.mentions[0].name;
					pic = message.mentions[0].avatarURL;
				}else{
					if(message.mentions.length >= 1){
						user = message.mentions[1].id;
						name = message.mentions[1].name;
						pic = message.mentions[1].avatarURL;
					}
				}
			}

			

			if(!profiles.hasOwnProperty(user)){
				bot.sendMessage(message.channel, name+" has no profile!");
				return;
			}

			var msg = "Profile for **"+name+"**";
			var keys = Object.keys(profiles[user]);
			msg += "```\n";
			console.dir(keys);
			for(i=0;i<keys.length;i++){
				if(profiles[user][keys[i]] != undefined){
					if(profiles[user][keys[i]].length >= 0){
						console.log(profiles[user][keys[i]]);
						msg += "\n"+keys[i].capFirst()+": "+profiles[user][keys[i]];
					}
				}
			}

			msg += "```";
			
			bot.sendMessage(message.channel, msg);

			if(pic != null){
				var ext = pic.split('.').pop();
				request.head(pic, function(err, res, body){
					request(pic).pipe(fs.createWriteStream("./data/images/profile."+ext)).on('close', function(){
						bot.sendFile(message.channel, "./data/images/profile."+ext);
					});
				});
			}

		},
		"desc": "Shows a user profile",
		"usage": "profile ``[user]``",
		"cooldown": 10
	},
	"cprofile": {
		process: function(args, message, bot){
			var user = message.author.id;
			if(profiles.hasOwnProperty(user)){
				bot.sendMessage(message.channel, "Hey! "+message.author.name+", You already have a profile!");
				return;
			}
			profiles[user] = {
				"location": "",
				"about": "",
				"email": "",
				"league": "",
				"minecraft": "",
				"steam": "",
				"timezone": "",
				"twitch": "",
				"twitter": "",
				"youtube": "",
				"reddit": "",
				"mal": ""
			};

			fs.writeFile("./data/profiles.json", JSON.stringify(profiles), 'utf8', function(err){
				if(err){ bot.sendMessage(message.channel, "```js\n"+err+"```"); return; }
				bot.sendMessage(message.channel, "Created profile for "+message.author.name);
			});
		},
		"desc": "Creates a profile",
		"usage": "cprofile",
		"cooldown": 10
	},
	"setprofile": {
		process: function(args, message, bot){
			var user = message.author.id;
			if(!profiles.hasOwnProperty(user)){
				bot.sendMessage(message.channel, "Hey! "+message.author.name+", You have no profile!");
				return;
			}
			if(args.length >= 3){
				var method = args[1].toLowerCase();
				var data = args.splice(2, args.length).join(" ");

				data = data.replace(/\`/gmi, "");
				console.log("data: "+data);

				for(i=0;i<message.mentions.length;i++){
					data = data.replace(new RegExp("<@"+message.mentions[i].id+">", "gmi"), "@"+message.mentions[i].name);
				}

				console.log("data: "+data);

				profiles[user][method] = data;

				fs.writeFile("./data/profiles.json", JSON.stringify(profiles), 'utf8', function(err){
					if(err){ bot.sendMessage(message.channel, "```js\n"+err+"```"); return; }
					bot.sendMessage(message.channel, "Set field ``"+method+"`` for "+message.author.name);
				});
			}
		},
		"desc": "Sets a profile field for user",
		"usage": "setprofile ``field`` ``data``",
		"cooldown": 10
	},
	"delprofile": {
		process: function(args, message, bot){
			var user = message.author.id;
			if(args.length >= 2){
				if(message.author.id == settings["owner"]){
					var user = message.mentions[0].id;

					delete profiles[user];

					fs.writeFile("./data/profiles.json", JSON.stringify(profiles), 'utf8', function(err){
						if(err){ bot.sendMessage(message.channel, "```js\n"+err+"```"); return; }
						bot.sendMessage(message.channel, "Deleted profile of "+message.mentions[0].name);
						return;
					});
				}
			}else{
				if(!profiles.hasOwnProperty(user)){
					bot.sendMessage(message.channel, "Hey! "+message.author.name+", You have no profile!");
					return;
				}else{
					delete profiles[user];

					fs.writeFile("./data/profiles.json", JSON.stringify(profiles), 'utf8', function(err){
						if(err){ bot.sendMessage(message.channel, "```js\n"+err+"```"); return; }
						bot.sendMessage(message.channel, "Deleted profile of "+message.author.name);
						return;
					});
					return;
				}
			}
		},
		"desc": "Deletes a profile",
		"usage": "delprofile",
		"cooldown": 10
	}
};

exports.profiles = profile;
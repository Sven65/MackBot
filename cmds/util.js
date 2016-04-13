var helper = require("../util/Helper.js");
var fs = require("fs");
var request = require('request');
var parseString = require('xml2js').parseString;
var fix = require('entities');
var os = require("os");
var mathjs = require("mathjs");
var moment = require("moment");
var process = require("process");
var cancer = require("../util/Cancer.js");
var qr = require('node-qr-image');
var images = require("../data/images.json");

var giveArray = [];
var giveStart = false;
var givechan = "";

String.prototype.capFirst = function(){
    return this.charAt(0).toUpperCase() + this.slice(1);
};

var util = {
	"8ball": {
		process: function(args, message, bot, settings){
			var reply = ["It is certain", "It is decidedly so",
				"Without a doubt", "Yes, definitely", 
				"You may rely on it", "As I see it, yes", 
				"Most likely", "Outlook good", "Yes", "Signs point to yes",
				"Reply hazy try again", "Ask again later",
				"Better not tell you now", "Cannot predict now",
				"Concentrate and ask again", "Don't count on it",
				"My reply is no", "My sources say no",
				"Outlook not so good", "Very doubtful"];

			if(args.length >= 2){
				bot.reply(message, reply[helper.rInt(0, reply.length-1)]);
			}else{
				bot.sendMessage(message.channel, "Usage: !8ball [question]");
			}
		},
		"desc": "A magic 8ball!",
		"usage": "8ball `question`",
		"cooldown": 10
	},
	"addword": {
		process: function(args, message, bot, settings){

			if(args.length >= 2){
				fs.readFile('words.txt', 'utf8', function(err, data){
				
					if(err){ throw err; }
					words = data.split("\n");

					console.log(words.indexOf(args[1]));
					if(helper.indexx(words, args[1].toLowerCase()) > -1){
						bot.reply(message, "I already know that word!");
					}else{
						fs.appendFile('./words.txt', '\n'+args[1], 'utf8', function(err){
							if(err){ throw err; }
						});
						bot.sendMessage(message.channel, "Added word: "+args[1]);
					}
				});
			}else{
				bot.sendMessage(message.channel, "Usage: !addword [word]");
			}
		},
		"desc": "Adds a word to the list",
		"usage": "addword `word`",
		"cooldown": 10
	},
	"anime": {
		process: function(args, message, bot, settings){

			if(args.length >= 2){
				

				var anime = args.splice(1, args.length).join("+");
				var apiURL = "http://myanimelist.net/api/anime/search.xml?q="+anime;

				request(apiURL, {"auth": {"user": settings['mal']['name'], "pass": settings['mal']['pass'], "sendImmediately": true}},
					function(error, response, body){
						if(error){ console.log(error); }
						if(!error && response.statusCode == 200){
							parseString(body, function(err, result){
								var animeArray = [];
								var synopsis = result.anime.entry[0].synopsis.toString();
								synopsis = synopsis.replace(/<br \/>/g, " ");
								synopsis = synopsis.replace(/\[(.{1,10})\]/g, "");
								synopsis = synopsis.replace(/\r?\n|\r/g, " ");
								synopsis = synopsis.replace(/\[(i|\/i)\]/g, "*");
								synopsis = synopsis.replace(/\[(b|\/b)\]/g, "**");
								synopsis = fix.decodeHTML(synopsis);
								if(synopsis.length > 1000){synopsis = synopsis.substring(0, 1000); synopsis += "...";}
								animeArray.push("__**" + result.anime.entry[0].title + "**__ - __**" + result.anime.entry[0].english +" - ["+result.anime.entry[0].status[0]+"] "+ "**__ • *" + result.anime.entry[0].start_date + "*  to *" + result.anime.entry[0].end_date + "*\n");
								animeArray.push("**Type:** *" + result.anime.entry[0].type + "*  **Episodes:** *" + result.anime.entry[0].episodes + "*  **Score:** *" + result.anime.entry[0].score + "*");
								animeArray.push(synopsis);
								bot.sendMessage(message.channel, animeArray);
							});
						}
					});
			}
		},
		"desc": "Shows info about anime",
		"usage": "anime `anime`",
		"cooldown": 10
	},
	"define": {
		process: function(args, message, bot, settings){
			if(args.length >= 2){
				var term = args.splice(1, args.length).join("+");
				request('http://api.urbandictionary.com/v0/define?term='+term, function(error, response, body){
					if(!error && response.statusCode == 200){
						var data = JSON.parse(body);
						if(data["result_type"] != "no_results"){
							var defArr = [];
							var def = data["list"][0]["definition"];

							def = def.replace(/<br \/>/g, " ");
							def = def.replace(/\[(.{1,10})\]/g, "");
							def = def.replace(/\r?\n|\r/g, " ");
							def = def.replace(/\[(i|\/i)\]/g, "*");
							def = def.replace(/\[(b|\/b)\]/g, "**");
							def = fix.decodeHTML(def);


							var example = data["list"][0]["example"];

							example = example.replace(/<br \/>/g, " ");
							example = example.replace(/\[(.{1,10})\]/g, "");
							example = example.replace(/\r?\n|\r/g, " ");
							example = example.replace(/\[(i|\/i)\]/g, "*");
							example = example.replace(/\[(b|\/b)\]/g, "**");
							example = fix.decodeHTML(example);


							if(def.length > 1000){def = def.substring(0, 1000); def += "...";}
							if(example.length > 250){example = example.substring(0, 250); example += "...";}
							defArr.push("__**"+term.replace(/\+/g, " ")+"**__\n");
							defArr.push("**Definition:** "+def);
							defArr.push("**Example:** "+example);

							bot.sendMessage(message.channel, defArr);
						}else{
							bot.sendMessage(message.channel, "No definition for "+term.replace(/\+/g, " ")+".");
						}
					}else{
						console.log(error);
					}
				});
			}
		},
		"desc": "Defines a term.",
		"usage": "define `term`",
		"cooldown": 10
	},
	"hug": {
		process: function(args, message, bot, settings){
			var usr = "";

			if(args.length >= 2){
				usr = args[1];
				if(usr == ""){
					usr = message.sender.name;
				}
			}else{
				usr = message.sender.name;
			}

			bot.sendMessage(message.channel, "*hugs "+usr+"*");
		},
		"desc": "Hugs!",
		"usage": "hug `(user)`",
		"cooldown": 10
	},
	"mal": {
		process: function(args, message, bot, settings){
			if(args.length >= 2){
				request('http://myanimelist.net/malappinfo.php?u='+args[1]+'&status=all&type=anime', function (error, response, body) {
				  if (!error && response.statusCode == 200){
				  	parseString(body, function (err, result) {
		    			var data = JSON.parse(JSON.stringify(result))['myanimelist'];
		    			if(data !== undefined){
		    				if(data.hasOwnProperty("error")){
		    					bot.sendMessage(message.channel, data["error"]);
		    				}else{
		    					console.dir(data["myinfo"][0]["user_name"]);
		    					data = data["myinfo"][0];
				    			bot.sendMessage(message.channel, "Anime stats of "+data["user_name"]+": Watching "+data["user_watching"]+" animes, Completed "+data["user_completed"]+" animes, Plan to watch "+data["user_plantowatch"]+" animes, Dropped "+data["user_dropped"]+" animes and "+data["user_onhold"]+" animes on hold. "+data["user_name"]+" has spent "+data["user_days_spent_watching"]+" days watching anime.");
				    		}
				    	}
					});
				    
				  }
				});
			}
		},
		"desc": "Shows info about a MAL user",
		"usage": "mal `user`",
		"cooldown": 10
	},
	"roll": {
		process: function(args, message, bot, settings){
			if(args.length >= 3){
				min = Number(args[1]);
				max = Number(args[2]);

				num = helper.rInt(min, max);

				bot.sendMessage(message.channel, "Rolled number: "+num);
			}else{
				bot.sendMessage(message.channel, "Usage: !roll [min] [max]");
			}
		},
		"desc": "Rolls a random number.",
		"usage": "roll `min` `max`",
		"cooldown": 10
	},
	"slap": {
		process: function(args, message, bot, settings){
			var usr = "";

			if(args.length >= 2){
				usr = args[1];
			}else{
				usr = message.sender.name;
			}

			bot.sendMessage(message.channel, "*slaps "+usr+"*");
		},
		"desc": "Slaps!",
		"usage": "slap `[user]`",
		"cooldown": 10
	},
	"uptime": {
		process: function(args, message, bot, settings){
			up = helper.fTime(os.uptime());
			botup = helper.fTime(process.uptime());
			bot.sendMessage(message.channel, "Uptime: "+up+"\nBot uptime: "+botup);
		},
		"desc": "The physical servers uptime.",
		"usage": "uptime",
		"cooldown": 10
	},
	"words": {
		process: function(args, message, bot, settings){
			var words = [];
			var word = "";

			fs.readFile('words.txt', 'utf8', function(err, data){
				
				if(err){ throw err; }
				words = data.split("\n");

				amt = 3;
				if(args.length > 1){
					amt = Number(args[1]);
					if(amt > settings["maxwords"]){
						amt = settings["maxwords"];
					}
				}

				for(i=0;i<amt;i++){
					word += words[helper.rInt(0, words.length-1)].replace(/(?:\r\n|\r|\n)/g, '')+" ";
				}

				bot.sendMessage(message.channel, word);
			});
		},
		"desc": "Picks some random words.",
		"usage": "words `[amount]`",
		"cooldown": 10
	},
	"strawpoll": {
		process: function(args, message, bot, settings){
			if(args.length >= 4){

				var options = message.cleanContent.substring(message.cleanContent.indexOf(" ")+1).split(/, ?/);

				request.post({
						"url": "https://strawpoll.me/api/v2/polls",
						"headers": {"content-type": "application/json"},
						"json": true,
						body: {
							"title": "" + options[0],
							"options": options.splice(1, options.length)
						}
					}, function(error, response, body){
						if(!error && response.statusCode == 201){
							bot.sendMessage(message, message.author.username.replace(/@/g, '@\u200b') + " created a strawpoll. Vote here: http://strawpoll.me/" + body.id);
						}else if(error){
							bot.sendMessage(msg, error);
						}else if(response.statusCode != 201){
							bot.sendMessage(message, "Got status code " + response.statusCode);
						}
					});
			}
		},
		"desc": "Create a strawpoll.",
		"usage": "strawpoll `question`, `option1`, `option2`, `[option3]`, `...`",
		"cooldown": 10
	},
	"request": {
		process: function(args, message, bot, settings){
			if(args.length >= 2){
				bot.sendMessage("141610251299454976", "__Requested by "+message.author.username+" on the server **"+message.channel.server.name+"**:__\n"+args.splice(1, args.length).join(" "));
			}
		},
		"desc": "Sends a feature request to the maker of this bot.",
		"usage": "request `feature to request`",
		"cooldown": 10
	},
	"calc": {
		process: function(args, message, bot, settings){
			if(args.length >= 2){
				if(args[1] == "0/0"){
					bot.sendMessage(message.channel, "Pfft. I'm a bot! I can't calculate 0/0!");
				}else{
					var term = args.splice(1, args.length).join(" ");
					try{
						var calc = mathjs.eval(term);
						bot.sendMessage(message.channel, calc);
					}catch(e){
						bot.sendMessage(message.channel, "Error! "+e);
					}
					
					
				}
			}
		},
		"desc": "Calculate math.",
		"usage": "calc `expression`",
		"cooldown": 10
	},
	"currency": {
		process: function(args, message, bot, settings){
			if(args.length >= 4){
				var amt = args[1];
				var from = args[2].toUpperCase();
				var to = args[3].toUpperCase();

				var link = "https://www.google.co.uk/finance/converter?a="+amt+"&from="+from+"&to="+to;

				request(link, function(error, response, body){
					if(!error && response.statusCode == 200){
						var result = body.match(/\<span class=bld\>(.+?)\<\/span\>/gmi)[0];
						if(result != undefined){
							bot.sendMessage(message.channel, amt+" "+from+" is "+result.replace(/\<span class=bld\>/, "").replace(/\<\/span\>/, ""));
						}else{
							bot.sendMessage(message.channel, "Couldn't find any rates!");
						}
					}
				});
			}
		},
		"desc": "Convert currencies.",
		"usage": "currency `amount` `from` `to`",
		"cooldown": 10
	},
	"ruser": {
		process: function(args, message, bot, settings){
			var gender;
			if(args.length >= 2){
				gender = args[1];
			}else{
				gender = "";
			}

			var link = "https://randomuser.me/api/?gender="+gender;

			request(link, function(error, response, body){
				if(!error && response.statusCode == 200){
					var result = JSON.parse(body)["results"][0];
					if(result != undefined){

						var userArr = [];

						userArr.push("__**"+result["name"]["title"].capFirst()+" "+result["name"]["first"].capFirst()+" "+result["name"]["last"].capFirst()+"**__\n\n");
						userArr.push("**Gender: **"+result['gender']+"\n");
						userArr.push("**Location: **"+result["location"]['street']+", "+result["location"]['postcode']+", "+result["location"]['city']+", "+result["location"]['state']+"\n");
						userArr.push("**Birthday: **"+moment.unix(result["dob"]).format("DD/MM/YYYY"));


						bot.sendMessage(message.channel, userArr);
					}else{
						bot.sendMessage(message.channel, "Whoops. Something went wrong.");
					}
				}
			});
		},
		"desc": "Generate a random user profile",
		"usage": "ruser `[gender]`",
		"cooldown": 600
	},
	"filter": {
		process: function(args, message, bot, settings){
			if(args.length >= 2){
				var term = args.splice(1, args.length).join(" ");

				term = term.replace(/mods/gi, "nazis");
				term = term.replace(/mod/gi, "hitler");
				term = term.replace(/witnesses/gi, "these dudes I know");
				term = term.replace(/witness/gi, "this dude I know");
				term = term.replace(/allegedly/gi, "kinda probably");
				term = term.replace(/new study/gi, "tumblr post");
				term = term.replace(/rebuild/gi, "avenge");
				term = term.replace(/space/gi, "spaaaace");
				term = term.replace(/google glass/gi, "virtual boy");
				term = term.replace(/senator/gi, "elf lord");
				term = term.replace(/election/gi, "eating contest");
				term = term.replace(/hacker/gi, "the hacker known as 4chan");
				term = term.replace(/anime fan/gi, "total fucking weeb");
				bot.sendMessage(message.channel, term);
			}
		},
		"desc": "Replaces words",
		"usage": "filter `string`",
		"cooldown": 10
	},
	"giveaway": {
		process: function(args, message, bot, settings){
			if(args.length >= 2){
				var act = args[1];
				if(act == "start"){
					if(settings["admins"].indexOf(message.author.id) > -1){
						if(!giveStart){
							giveStart = true;
							giveChan = message.channel.id;
							bot.sendMessage(message.channel, "Giveaway started! Use ``"+settings["prefix"]["main"]+"giveaway join`` to join!");
						}
					}
				}else if(act == "join" && message.channel.id == giveChan){
					if(giveArray.indexOf(message.author.id) == -1 && giveStart){
						giveArray.push(message.author.id);
					}
				}else if(act == "stop"){
					if(settings["admins"].indexOf(message.author.id) > -1){
						if(giveStart){
							giveStart = false;
							bot.sendMessage(message.channel, "Giveaway stopped! The winner is <@"+giveArray[helper.rInt(0, giveArray.length-1)]+">! Congratulations!");
							giveArray = [];
						}
					}
				}else if(act == "stats"){
					if(giveStart){
						bot.sendMessage(message.channel, giveArray.length+" Users in the giveaway. Each user has a "+100/giveArray.length+"% chance of winning.");
					}
				}
			}
		},
		"desc": "General giveaway commands",
		"usage": "giveaway ``start`` or ```join`` or ``stop``",
		"cooldown": 10
	},
	"wtfsimfd": {
		process: function(args, message, bot, settings){
			request("http://www.whatthefuckshouldimakefordinner.com/index.php", function(error, response, body){
				if(!error && response.statusCode == 200){
					var head = body.match(/\<dl\>([^]+?)\<\/dl\>/gmi);
					if(head != null){
						var make = head[1].replace(/\n/gmi, "").replace(/\<dl/gmi, "").replace(/dl\>/gmi, "").replace(/\<\//gmi, "").replace(/\<dt\>/gmi, "").replace(/\\/gmi, "").replace(/\<a\>/gmi, "").replace(/\<a/gmi, "").replace(/dt\>/gmi, "");
						var link = make.match(/\"(.+?)\"/gmi)[0].replace(/\"/gmi, "");
						var food = fix.decodeHTML(make.match(/\"\>(.+?)\>/gmi)[0].replace(/\"\>/gmi, "").replace(/\</gmi, "").replace(/a\>/gmi, ""));
						var head2 = head[0].replace(/\n/gmi, "").replace(/\<dl>/gmi, "").replace(/\<\/dl\>/gmi, "");
						bot.sendMessage(message.channel, "**"+head2+"** "+food+" ("+link+")");
					}
				}

			});
		},
		"desc": "What the fuck should I make for dinner?",
		"usage": "wtfsimfd",
		"cooldown": 10
	},
	"cancer": {
		process: function(args, message, bot, settings){
			var term = args.splice(1, args.length).join(" ");
			bot.sendMessage(message.channel, cancer.cancer(term));
		},
		"desc": "Cancerifies a string",
		"usage": "cancer ``string``",
		"cooldown": 10
	},
	"qr": {
		process: function(args, message, bot, settings){
			if(args.length >= 2){
				var term = args.splice(1, args.length).join(" ");
				var qrcode = qr.imageSync(term, { type: 'png' });
				
				bot.sendFile(message.channel, qrcode);
			}
		},
		"desc": "Generates a QR code",
		"usage": "qr ``string``",
		"cooldown": 10
	},
	"simage": {
		process: function(args, message, bot, settings){
			if(args.length >= 3){
				var url = args[1];
				var name = args[2];
				var ext = url.split('.').pop();
				var intName = helper.rInt(100000000, 999999999).toString(36).toLowerCase()+"."+ext;
				if(images.hasOwnProperty(name)){
					bot.sendMessage(message.channel, "Image ``"+name+"`` already exists.");
					return;
				}
				request.head(url, function(err, res, body){
					request(url).pipe(fs.createWriteStream("./data/images/"+intName)).on('close', function(){
						images[name] = intName;
						fs.writeFile("./data/images.json", JSON.stringify(images), 'utf8', function(err){
							if(err){ throw err; }
							bot.sendMessage(message.channel, "Saved image: "+name);
						});
					});
				});
			}
		},
		"desc": "Saves an image",
		"usage": "simage ``url`` ``name``",
		"cooldown": 10
	},
	"image": {
		process: function(args, message, bot, settings){
			if(args.length >= 2){
				var file = args[1];
				if(images.hasOwnProperty(file)){
					bot.sendFile(message.channel, "./data/images/"+images[file]);
				}else{
					bot.sendMessage(message.channel, "No such image.");
				}
			}
		},
		"desc": "Shows an image",
		"usage": "image ``image``",
		"cooldown": 10
	},
	"imagelist": {
		process: function(args, message, bot, settings){
			bot.sendMessage(message.channel, Object.keys(images).sort().join(", "));
		},
		"desc": "Lists available images",
		"usage": "imagelist",
		"cooldown": 10
	}
};

exports.util = util;
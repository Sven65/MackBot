var helper = require("../util/Helper.js");
var request = require('request');
var settings = require("../settings.json");

var nsfw = {
	"hentai": {
		process: function(args, message, bot){
			var tag;
			if(args.length >= 2){
				tag = args.splice(1, args.length).join("_").replace(new RegExp(/loli/g), "flat_chest");
			}else{
				tag = "";
			}

			var link = "http://danbooru.donmai.us/posts?page="+helper.rInt(0, 15)+"&tags="+tag;

			
			request(link, function(error, response, body){
				if(!error && response.statusCode == 200){
					var img = body.match(/data-large-file-url=\"(.*)\"/gm);
					if(img != null){
						bot.sendMessage(message, "http://danbooru.donmai.us"+img[helper.rInt(0, img.length)].replace(new RegExp(/data-large-file-url=/g), "").replace(new RegExp(/\"/g), ""));
					}else{
						bot.sendMessage(message, "Couldn't find any images with the tag(s) `"+tag.replace(/_/g, " ")+"`");
					}
				}
			});
		},
		"desc": "Hentai!",
		"usage": "hentai `[tags]`",
		"cooldown": 10,
		"nsfw": true
	},
	"e621": {
		process: function(args, message, bot){
			var tag;
			if(args.length >= 2){
				tag = args.splice(1, args.length).join("+");
			}else{
				tag = "";
			}

			var link = "https://e621.net/post/index.json?limit=30&tags="+tag;

			request(link, function(error, response, body){
				if(!error && response.statusCode == 200){
					var data = JSON.parse(body);
					if(data.length < 1){
						bot.sendMessage(message.channel, "Couldn't find any images with the tag(s) `"+tag.replace(/\+/g, " ")+"`");
					}else{
						bot.sendMessage(message.channel, data[helper.rInt(0, data.length)].file_url);
					}
				}else{
					console.dir(error);
					console.dir(response.statusCode);
				}
			});
		},
		"desc": "Glorious e621!",
		"usage": "e621 `[tags]`",
		"cooldown": 10,
		"nsfw": true
	},
	"rule34": {
		process: function(args, message, bot){
			var tag;
			if(args.length >= 2){
				tag = args.splice(1, args.length).join("_");
			}else{
				tag = "";
			}

			var link = "http://rule34.xxx/index.php?page=dapi&s=post&q=index&limit=100&tags="+tag;

			request(link, function(error, response, body){
				if(!error && response.statusCode == 200){
					var img = body.match(/file_url=\"(.*)\"/gm);
					if(img != null){
						bot.sendMessage(message, "http:"+img[helper.rInt(0, img.length)].split(" ")[0].replace(/file_url=/g, "").replace(/\"/g, ""));
					}else{
						bot.sendMessage(message, "Couldn't find any images with the tag(s) `"+tag.replace(/_/g, " ")+"`");
					}
				}else{
					console.dir(error);
					console.dir(response.statusCode);
				}
			});
		},
		"desc": "If it exists, there's porn of it.",
		"usage": "rule34 `[tags]`",
		"cooldown": 10,
		"nsfw": true
	},
	"boobs": {
		process: function(args, message, bot){
			var link = "http://api.oboobs.ru/boobs/"+helper.rInt(0,9380);
			request(link, function(error, response, body){
				console.log(body);
				if(!error && response.statusCode == 200){
					if(JSON.parse(body)){
						var x = JSON.parse(body);
						var img = "http://media.oboobs.ru/"+x[0]["preview"];
						bot.sendMessage(message.channel, img);
					}
					
				}else{
					bot.sendMessage(message.channel, "```js\nERROR\n"+error+"\nResponse: "+response.statusCode+"```");
				}
			});
		},
		"desc": "Booooobssss",
		"usage": "boobs",
		"cooldown": 10,
		"nsfw": true
	},
	"butt": {
		process: function(args, message, bot){
			var link = "http://api.obutts.ru/butts/"+helper.rInt(0,3500);
			console.log(link);
			request(link, function(error, response, body){
				console.log(body);
				if(!error && response.statusCode == 200){
					try{
						var x = JSON.parse(body);
						var img = "http://media.obutts.ru/"+x[0]["preview"];
						bot.sendMessage(message.channel, img);
					}catch(e){
						bot.sendMessage(message.channel, "```js\n"+e+"```");
					}
				}else{
					bot.sendMessage(message.channel, "```js\nERROR\n"+error+"\nResponse: "+response.statusCode+"```");
				}
			});
		},
		"desc": "Butts :D",
		"usage": "butt",
		"cooldown": 10,
		"nsfw": true
	},
};

exports.nsfw = nsfw;
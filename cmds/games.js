var settings = require("../settings.json");
var helper = require("../util/Helper.js");
var users = require("../data/users.json");
var fs = require("fs");

function shuffle(array){
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while(0 !== currentIndex){
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

var games = {
	"ginfo": {
		process: function(args, message, bot, settings){
			var msg = "```js\n";
			var usr;
			if(users.hasOwnProperty(message.author.id)){
				usr = users[message.author.id];
			}else{
				usr = {"bal": 100, "wins": 0, "losses": 0, "games": 0};
				users[message.author.id] = usr;
				fs.writeFile("./data/users.json", JSON.stringify(users), 'utf8', function(err){
					if(err){ throw err; }
				});
			}
			msg += "User: "+message.author.name;
			msg += "\nBalance: "+usr["bal"]+" Coins";
			msg += "\nWins/Losses: "+usr["wins"]+"/"+usr["losses"];
			msg += "\nGames played: "+usr["games"]+"```";
			bot.sendMessage(message.channel, msg);
		},
		"desc": "Shows info about a user",
		"usage": "ginfo",
		"cooldown": 10
	},
	"groll": {
		process: function(args, message, bot, settings){
			var amt = 1;
			if(args.length >= 2){
				var amt = Number(args[1]);
			}

			if(amt > users[message.author.id]["bal"]){
				bot.sendMessage(message.channel, "Hey, "+message.author.name+", You don't have enough coins to bet that much!");
				return;
			}

			var num = helper.rInt(1, 6);
			users[message.author.id]["games"]++;
			var msg = "Rolled: "+num;

			users[message.author.id]["bal"] -= amt;

			if(num == 4){
				msg += "\nYou won: "+amt+" Coin!";
				users[message.author.id]["bal"] += amt;
				users[message.author.id]["wins"]++;
			}else if(num == 5){
				var win = amt*1.5;
				msg += "\nYou won: "+win+" Coins!";
				users[message.author.id]["bal"] += win;
				users[message.author.id]["wins"]++;
			}else if(num == 6){
				var win = amt*2;
				msg += "\nYou won "+win+" coins!";
				users[message.author.id]["bal"] += win;
				users[message.author.id]["wins"]++;
			}else{
				msg += "\nYou didn't win anything :(";
				users[message.author.id]["losses"]++;
			}


			fs.writeFile("./data/users.json", JSON.stringify(users), 'utf8', function(err){
				if(err){ throw err; }
				bot.sendMessage(message.channel, msg);
			});
		},
		"desc": "Rolls the dice! Win table: ``4: 1x``, ``5: 1.5x``, ``6: 2x``",
		"usage": "groll ``[amt]``",
		"cooldown": 10
	},
	"gslots": {
		process: function(args, message, bot, settings){
			var amt = 1;
			if(args.length >= 2){
				amt = Number(args[1]);
			}
			if(amt > users[message.author.id]["bal"]){
				bot.sendMessage(message.channel, "Hey, "+message.author.name+", You don't have enough coins to bet that much!");
				return;
			}

			users[message.author.id]["bal"] -= amt;

			var chars = shuffle([":cherries:", ":cherries:", ":cherries:", ":cherries:", ":cherries:", ":cherries:",
			 ":lemon:", ":lemon:", ":lemon:", ":lemon:", ":lemon:", 
			 ":tangerine:", ":tangerine:", ":tangerine:", ":tangerine:", 
			 ":banana:",  ":banana:", ":banana:", 
			 ":eggplant:", ":eggplant:",
			  ":gem:", 
			  ":black_joker:"]);
			var line1 = [];
			var line2 = [];
			var line3 = [];
			for(i=0;i<3;i++){
				line1.push(chars[helper.rInt(0, chars.length-1)]);
			}
			for(i=0;i<3;i++){
				line2.push(chars[helper.rInt(0, chars.length-1)]);
			}
			for(i=0;i<3;i++){
				line3.push(chars[helper.rInt(0, chars.length-1)]);
			}

			var msg = [];
			msg.push(line1.join(""));
			msg.push(line2.join(""));
			msg.push(line3.join(""));

			bot.sendMessage(message.channel, msg);

			msg = "";

			var table = line2.join("");
			console.log(table);

			if(table == ":cherries::cherries::cherries:"){
				var win = amt;
				msg = "You won "+win+" coins!";
				users[message.author.id]["bal"] += win;
				users[message.author.id]["wins"]++;
			}else if(table == ":lemon::lemon::lemon:"){
				var win = amt*1.25;
				msg = "You won "+win+" coins!";
				users[message.author.id]["bal"] += win;
				users[message.author.id]["wins"]++;
			}else if(table == ":tangerine::tangerine::tangerine:"){
				var win = amt*1.50;
				msg = "You won "+win+" coins!";
				users[message.author.id]["bal"] += win;
				users[message.author.id]["wins"]++;
			}else if(table == ":banana::banana::banana:"){
				var win = amt*1.75;
				msg = "You won "+win+" coins!";
				users[message.author.id]["bal"] += win;
				users[message.author.id]["wins"]++;
			}else if(table == ":eggplant::eggplant::eggplant:"){
				var win = amt*2;
				msg = "You won "+win+" coins!";
				users[message.author.id]["bal"] += win;
				users[message.author.id]["wins"]++;
			}else if(table == ":gem::gem::gem:"){
				var win = amt*2.25;
				msg = "You won "+win+" coins!";
				users[message.author.id]["bal"] += win;
				users[message.author.id]["wins"]++;
			}else if(table == ":black_joker::black_joker::black_joker:"){
				var win = amt*2.50;
				msg = "You won "+win+" coins!";
				users[message.author.id]["bal"] += win;
				users[message.author.id]["wins"]++;
			}else{
				msg = "You didn't win anything :(";
				users[message.author.id]["losses"]++;
			}

			users[message.author.id]["games"]++;
			fs.writeFile("./data/users.json", JSON.stringify(users), 'utf8', function(err){
				if(err){ throw err; }
				bot.sendMessage(message.channel, msg);
			});
		},
		"desc": "Spins the slots! Three in a row gives a win!",
		"usage": "gslots ``[amount]``",
		"cooldown": 10
	},
	"gcoins": {
		process: function(args, message, bot, settings){
			if(settings["owner"] == message.author.id){
				if(args.length >= 3){
					var to = message.mentions[0].id;
					var amt = args[2];
					users[to]["bal"]+= Number(amt);
					fs.writeFile("./data/users.json", JSON.stringify(users), 'utf8', function(err){
						if(err){ throw err; }
						bot.sendMessage(message.channel, "Gave <@"+to+"> "+amt+" coins");
					});
				}
			}
		},
		"desc": "Gives a user coins",
		"usage": "gcoins ``user`` ``coins``",
		"cooldown": 10
	}
};

exports.games = games;
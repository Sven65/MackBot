var defaults = {
	"info": {
		process: function(args, message, bot, settings){
			var owner = bot.users.get("id", settings["owner"]).name;
			bot.sendMessage(message.channel, "```\nMackBot Version "+settings["version"]+"\nPrefix: "+settings["prefix"]["main"]+"\nUsing: discord.js\nOwner: "+owner+"\nMore info: https://github.com/Sven65/MackBot```");
		},
		"desc": "Bot info",
		"usage": "info"
	}
};

exports.defaults = defaults;
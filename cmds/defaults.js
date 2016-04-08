var defaults = {
	"info": {
		process: function(args, message, bot, settings){
			var owner = bot.users.get("id", settings["owner"]).name;
			bot.sendMessage(message.channel, "```\nMackBot Version "+settings["version"]+"\nPrefix: "+settings["prefix"]+"\nUsing: discord.js\nOwner: "+owner+"```");
		},
		"desc": "Bot info",
		"usage": "info"
	}
};

exports.defaults = defaults;
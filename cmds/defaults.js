var defaults = {
	"info": {
		process: function(args, message, bot, settings){
			var owner = "<@"+settings["owner"]+">";
			bot.sendMessage(message.channel, "```\nMackBot Version "+settings["version"]+"\nPrefix: "+settings["prefix"]+"\nUsing: discord.js\nOwner: "+owner+"```");
		},
		"desc": "Bot info",
		"usage": "info"
	}
};

exports.defaults = defaults;
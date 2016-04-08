var defaults = {
	"info": {
		process: function(args, message, bot, settings){
			bot.sendMessage("```\nMackBot Version "+settings["version"]+"\nPrefix: "+settings["prefix"]+"\nUsing: discord.js\nOwner: <@"+settings["qwner"]+">```");
		},
		"desc": "Bot info",
		"usage": "info"
	}
};

exports.defaults = defaults;
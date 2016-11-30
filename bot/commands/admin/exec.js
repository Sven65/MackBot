const child = require("child_process");
module.exports = {
	Execute: function(Args, message){
		if(message.author.id === MackBot.Config.Owner){
			try{
				let Code = Args.join(" ");
				child.exec(Code, function (error, stdout, stderr) {
					if(error){
						message.channel,sendCode("sh", "ERR "+error);
					}else if(stderr){
						message.channel.sendCode("sh", "STDERR "+error);
					}else{
						message.channel.sendCode("sh", stdout);
					}
				});
			}catch(e){
				Common.sendError(message, e);
			}
		}else{
			message.channel.sendMessage(`Sorry, ${message.author.username}, but you can't do this.`);
		}
	},
	Desc: "Restarts the current shard.",
	Usage: "",
	Cooldown: 0,
	Unlisted: true
};
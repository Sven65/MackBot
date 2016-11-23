module.exports = {
	Execute: (Args, message) => {
		if(message.channel.type === "text"){
			if(message.channel.permissionsFor(message.author).hasPermission("MANAGE_CHANNELS")){
				let Topic = " ";
				if(Args.length >= 2){
					Topic = Args.join(" ");
				}
				message.channel.setTopic(Topic);
			}else{
				message.channel.sendMessage(`:x: You don't have permission, ${message.author.username}.`);
			}
		}else{
			message.channel.sendMessage(`:x: Can't change the topic of a private message.`);
		}
	},
	Description: "Changes the topic of a channel.",
	Usage: "`[topic]`",
	Cooldown: 5
}
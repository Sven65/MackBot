module.exports = {
	Execute: (Args, message) => {
		if(message.channel.type === "text"){
			if(Args.length >= 1){
				let Command = Args[0].toLowerCase();
				let Guild = new Server.Server(message.guild.id);
				if(message.member.roles.find("name", "MackBot Commander") !== null){
					if(MackBot.Commands.All.indexOf(Command) > -1){
						Guild.toggled.then((toggled) => {
							if(toggled.indexOf(Command) > -1){
								Guild.toggleOff(Command).then(() => {
									message.channel.sendMessage(`:white_check_mark: Command \`${Command}\` turned on for server.`);
								}).catch((e) => {
									MackBot.sendError(message, e);
								});
							}else{
								Guild.toggleOn(Command).then(() => {
									message.channel.sendMessage(`:white_check_mark: Command \`${Command}\` turned off for server.`);
								}).catch((e) => {
									MackBot.sendError(message, e);
								});
							}
						}).catch((e) => {
							MackBot.sendError(message, e);
						});
					}
				}else{
					message.channel.sendMessage(`:x: You don't have a role called \`MackBot Commander\`, ${message.author.username}.`);
				}
			}
		}else{
			message.channel.sendMessage(`:x: You can't do this in private messages, ${message.author.username}.`);
		}
	},
	Description: "Toggles commands on or off.",
	Usage: "`<command>`",
	Cooldown: 10
}
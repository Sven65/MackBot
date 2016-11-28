module.exports = {
	Execute: (Args, message) => {
		let user = new User.User(message.author.id);
		let profile = new User.Profile(user);

		profile.getProfile().then((prof) => {
			if(prof === null){
				message.channel.sendMessage(`:x: You don't have a profile, ${message.author.username}.`);
				return;
			}

			if(Args.length >= 2){
				let Field = Args[0].toLowerCase();
				let Data = Args.splice(1, Args.length).join(" ");

				for(let usr in message.mentions.users){
					let Regex = new RegExp(`<@${usr.id}>`, "gmi");
					Data = Data.replace(Regex, `@${usr.username}`);
				}

				profile.setProfile(Field, Data).then(() => {
					message.channel.sendMessage(`:white_check_mark: Set field \`${Field}\` of ${message.author.username}'s profile.`);
				}).catch((e) => {
					MackBot.SendError(message, e);
				});
			}else{
				message.channel.sendMessage(`:x: Not enough arguments, ${message.author.username}.`)
			}

		}).catch((e) => {
			MackBot.SendError(message, e);
		});
	},
	Description: "Sets a profile field for a user.",
	Usage: "`<field>`, `<data>`",
	Cooldown: 10
}
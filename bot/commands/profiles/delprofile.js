module.exports = {
	Execute: (Args, message) => {
		let user = new User.User(message.author.id);
		let profile = new User.Profile(user);

		profile.getProfile().then((prof) => {
			if(prof === null){
				message.channel.sendMessage(`:x: You don't have a profile, ${message.author.username}.`);
				return;
			}

			profile.delete().then(() => {
				message.channel.sendMessage(`:white_check_mark: Deleted profile for ${message.author.username}`);
			}).catch((e) => {
				MackBot.sendError(message, e);
			});
		}).catch((e) => {
			MackBot.sendError(message, e);
		});
	},
	Description: "Deletes a profile",
	Usage: "",
	Cooldown: 10
}
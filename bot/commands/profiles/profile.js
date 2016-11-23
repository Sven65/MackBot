module.exports = {
	Execute: (Args, message) => {

		let usr = message.author;
		let isSelf = true;

		if(message.mentions.users.size > 0){
			usr = message.mentions.users.first();
			isSelf = false;
		}

		let user = new User.User(usr.id);
		let profile = new User.Profile(user);
		
		profile.getProfile().then((prof) => {
			let Msg = "";
			if(prof === null){
				if(isSelf){
					Msg = `You don't have a profile ${user.username}.`;
				}else{
					Msg = `No profile found for ${user.username}.`;
				}
				message.channel.sendMessage(Msg);
				return;
			}else{

				Msg = `Profile for **${user.username}**`;
				Msg += "\n```\n";

				for(Field in prof){
					if(prof[Field].length > 0){
						Msg += `\n${Field.capFirst()}: ${prof[Field]}`;
					}
				}

				Msg += "```";

				if(usr.avatarURL !== undefined && usr.avatarURL !== null){
					Msg += `\n${user.avatarURL}`;
				}

				let embedPerms = false;

				if(message.channel.type !== "text"){
					embedPerms = true;
				}else{
					if(message.channel.permissionsFor(MackBot.user).hasPermission("EMBED_LINKS")){
						embedPerms = true;
					}
				}

				if(!embedPerms){
					message.channel.sendMessage(Msg);
				}else{
					let DataMessage = {
						"embed": {
							"title": "",
							"type": "rich",
							"color": 0xf44274,
							"author": {
								"name": `${message.author.username}'s Profile`
							},
							"fields": [
								
							]
						}
					}

					if(usr.avatarURL !== undefined && usr.avatarURL !== null){
						DataMessage.embed.thumbnail = {
							url: usr.avatarURL
						};
					}

					for(Field in prof){
						if(prof[Field].length > 0){
							DataMessage.fields.push({
								"name": Field.capFirst(),
								"value": prof[Field],
								"inline": true
							});
						}
					}

					message.channel.sendMessage('', DataMessage);
				}
			}
		});
	},
	Description: "Shows a users profile",
	Usage: "`[@user]`",
	Cooldown: 10
}
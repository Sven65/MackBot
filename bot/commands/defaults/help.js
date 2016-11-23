module.exports = {
	Execute: (Args, message) => {
		let sid = "";
		if(message.channel.type === "text"){
			sid = message.guild.id;
		}

		let Guild = new Server.Server(sid);

		Guild.prefix.then((prefix) => {
			try{
				if(args.length >= 2){
					let Command = args[1].toLowerCase();
					if(MackBot.Commands.All.indexOf(Command) > -1){

						let helpMsg = `__**${Command.capFirst()}**__\n\n`;
						helpMsg += MackBot.Commands.List[MackBot.Commands.Map[Command]][Command].Description+"\n\n";

						helpMsg += `**Usage: **\`${prefix}${Command.capFirst()}\` ${MackBot.Commands.List[MackBot.Commands.Map[Command]][Command].usage}\n\n`;
						helpMsg += `**Cooldown: ** ${MackBot.Commands.List[MackBot.Commands.Map[Command]][Command].cooldown.formatNumber()} seconds.`;
						if(MackBot.Commands.List[MackBot.Commands.Map[Command]][Command].hasOwnProperty("Extra")){
							for(let Extra in MackBot.Commands.List[MackBot.Commands.Map[Command]][Command].Extra){
								helpMsg += "\n";
								helpMsg += `**${Extra.replace("__", " ")}: `;
								if(Array.isArray(MackBot.Commands.List[MackBot.Commands.Map[Command]][Command].Extra[Extra])){
									helpMsg += `${MackBot.Commands.List[MackBot.Commands.Map[Command]][Command].Extra[Extra].join(', ')}`;
									helpMsg += "**";
								}
							}
						}

						let cmd = MackBot.Commands.List[MackBot.Commands.Map[Command]][Command];

						let embedPerms = false;

						if(message.channel.type !== "text"){
							embedPerms = true;
						}else{
							if(message.channel.permissionsFor(MackBot.user).hasPermission("EMBED_LINKS")){
								embedPerms = true;
							}
						}

						if(!embedPerms){
							message.channel.sendMessage(helpMsg);
						}else{
							let embed = {
								"embed": {
									"title": "",
									"type": "rich",
									"color": 0x2ead67,
									"author": {
										"name": `${Command.capFirst()}`
									},
									"description": cmd.desc,
									"fields": [
										{
											"name": "Usage",
											"value": `${prefix}${Command} ${cmd.usage}`,
											"inline": true
										},
										{
											"name": "Cooldown",
											"value": `${cmd.cooldown.formatNumber()} Seconds`,
											"inline": true
										}
									]
								}
							};

							for(let Extra in cmd.Extra){
								helpMsg += "\n";
								helpMsg += `**${Extra.replace("__", " ")}: `;
								if(Array.isArray(cmd.Extra[Extra])){
									embed.embed.fields.push({
										"name": Extra.replace("__", " "),
										"value": cmd.Extra[Extra].join(', '),
										"inline": true
									});
								}else{
									embed.embed.fields.push({
										"name": Extra.replace("__", " "),
										"value": cmd.Extra[Extra],
										"inline": true
									})
								}
							}

							message.channel.sendMessage('', embed).catch((e) => {
								Common.sendError(message, e);
							});	
						}
					}
				}else{
					let msg = `Hello, ${message.author.username}. I'm ${MackBot.user.username}.\nFor a list of the commands I recognize, you can type \`\`${prefix}commands\`\``;
					if(Config.prefix.MackBotname){
						msg+= `, \`\`${MackBot.user.username} commands\`\` or \`\`@${MackBot.user.username} commands\`\``;
					}
					msg += ".";
					message.channel.sendMessage(msg);
				}
			}catch(e){
				console.log(e);
			}
		});
	},
	desc: "Shows the help message",
	usage: "`[command]`",
	cooldown: 10,
	cmsg: 5
}
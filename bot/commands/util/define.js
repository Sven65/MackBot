const request = require("superagent");
const fix = require("entities");

module.exports = {
	Execute: (Args, message) => {
		if(Args.length >= 1){
			let Term = Args.join("+");
			let ApiURL = `http://api.urbandictionary.com/v0/define?term=${Term}`;

			request.get(ApiURL).buffer(true).end((err, res) => {
				if(!err && res.statusCode === 200){
					try{
						if(res.body.result_type === "no_results"){
							message.channel.sendMessage(`No definition found, ${message.author.username}.`);
							return;
						}

						let Definition = res.body.list[0];

						let Def = Definition.definition;
							Def.replace(/\r\n/gm, "\n");
							Def = fix.decodeHTML(Def);

						let Example = Definition.example;
							Example = Example.replace(/\r\n/gm, "\n");
							Example = fix.decodeHTML(Example);



						/*if(Def.length > 1000){
							Def = `${Def.substring(0, 1000)}...`;
						}*/

						if(Def.length <= 1000){

							let Matches = Def.match(/\[(.*?)\]/gi);

							if(Matches !== null){
								Matches.forEach((stri) => {
									let rpl = stri.replace("[", "").replace("]", "")
									Def = Def.replace(stri, `[${rpl}](http://${rpl.replace(/ /g, "")}.urbanup.com)`)
								});
							}
						}

						//Def = Def.replace(/\n/g, "");

						console.log(Def);

						if(Example.length > 1000){
							Example = `${Example.substring(0, 1000)}...`;
						}

						let Msg = `__**${Definition.word}**__ by __**${Definition.author}**__\n`;
						Msg += `**Definition:** ${Def}\n`;
						Msg += `**Example:** ${Example}\n`;
						Msg += `\n\n[***<${Definition.permalink}>***]`;

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
									"type": "rich",
									"color": 0xf44274,
									"author": {
										"name": `${Definition.word} by ${Definition.author}`,
										"url": Definition.permalink
									},
									"fields": [
										{
											"name": "Definition",
											"value": `${Def}`,
											"inline": false,
											"short": false
										},
										{
											"name": "Example",
											"value": Example,
											"inline": false
										},
										{
											"name": "Thumbs Up",
											"value": Definition.thumbs_up.formatNumber(),
											"inline": true
										},
										{
											"name": "Thumbs Down",
											"value": Definition.thumbs_down.formatNumber(),
											"inline": true
										}
									]
								}
							}

							console.dir("a", DataMessage.embed.fields[0].value.toString());

							message.channel.sendMessage('', DataMessage).catch((e) => {
								//console.dir(e);
							});
						}
					}catch(e){
						MackBot.SendError(message, e);
					}
				}else{
					message.channel.sendMessage(`:x: Got error ${res.statusCode}.`);
				}
			});
		}else{
			message.channel.sendMessage(`:x: Not enough arguments, ${message.author.username}`);
		}
	},
	Description: "Defines a term",
	Usage: "`<term>`",
	Cooldown: 15
}
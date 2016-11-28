const parseString = require('xml2js').parseString;
const request = require("superagent");
const fix = require("entities");

module.exports = {
	Execute: (Args, message) => {
		if(Args.length >= 1){
			let Anime = Args.join("+");
			let ApiURL = `https://myanimelist.net/api/anime/search.xml?q=${Anime}`;

			let token = new Buffer([MackBot.Config.mal.User, MackBot.Config.mal.Pass].join(':')).toString('base64');

			request.get(ApiURL).set("Authorization", `Basic ${token}`).type('xml').buffer(true).end((err, res) => {
				if(!err && res.statusCode === 200){
					parseString(res.text, (err, result) => {
						if(err){
							MackBot.SendError(message, err);
							return;
						}

						let Anime = result.anime.entry[0];

						let Synopsis = Anime.synopsis.toString();
							Synopsis = Synopsis.replace(/<br \/>/g, " ");
							Synopsis = Synopsis.replace(/\[(.{1,10})\]/g, "");
							Synopsis = Synopsis.replace(/\r?\n|\r/g, " ");
							Synopsis = Synopsis.replace(/\[(i|\/i)\]/g, "*");
							Synopsis = Synopsis.replace(/\[(b|\/b)\]/g, "**");

							Synopsis = fix.decodeHTML(Synopsis);

						if(Synopsis.length > 1000){
							Synopsis = `${Synopsis.substring(0, 1000)}...`;
						}

						

						let Msg = `__**${Anime.title}**__ ${Anime.english[0].length>0?'- __**'+Anime.english[0]+'**__':''} - __** ${Anime.status[0]} **__ • *${Anime.start_date}* to *${Anime.end_date}*\n`;
						Msg += `**Type:** *${Anime.type}* **Episodes:** *${parseInt(Anime.episodes[0]).formatNumber()}* **Score:** *${Anime.score[0]}*\n`;
						Msg += `${Synopsis}`;

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
										"name": `${Anime.title}`,
										"url": `https://myanimelist.net/anime/${Anime.id}`
									},
									"fields": [
										{
											"name": "Status",
											"value": Anime.status[0],
											"inline": true
										},
										{
											"name": "Start Date",
											"value": Anime.start_date[0],
											"inline": true
										},
										{
											"name": "End Date",
											"value": Anime.end_date[0],
											"inline": true
										},
										{
											"name": "Type",
											"value": Anime.type[0],
											"inline": true
										},
										{
											"name": "Episodes",
											"value": parseInt(Anime.episodes[0]).formatNumber(),
											"inline": true
										},
										{
											"name": "Score",
											"value": Anime.score[0],
											"inline": true
										},
										{
											"name": "Synopsis",
											"value": Synopsis,
											"inline": false
										}
									]
								}
							}

							if(Anime.english[0].length > 0){
								DataMessage.embed.fields.push({
									"name": "English",
									"value": Anime.english[0],
									"inline": true
								});
							}

							if(Anime.image[0] !== undefined && Anime.image[0] !== null){
								DataMessage.embed.thumbnail = {
									url: Anime.image[0]
								};
							}

							message.channel.sendMessage('', DataMessage);
						}

					});
				}else if(res.statusCode === 204){
					message.channel.sendMessage(`:x: No anime was found, ${message.author.username}.`);
				}else{
					message.channel.sendMessage(`:x: Got error ${res.statusCode}.`);
				}
			});

		}else{
			message.channel.sendMessage(`:x: Not enough arguments, ${message.author.username}`);
		}
	},
	Description: "Shows info about an anime",
	Usage: "`<anime>`",
	Cooldown: 15
}
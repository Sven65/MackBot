module.exports = {
	Execute: (Args, message) => {
		let user = new User.User(message.author.id);
		let userGame = new User.Game(user);

		userGame.stats.then((stats) => {
			if(stats === null){
				message.channel.sendMessage(`:x: Please get your stats first, ${message.author.username}.`);
				return;
			}

			let Amount = 1;
			if(Args.length >= 1){
				Amount = parseInt(Args[0]) || 1;
			}
			if(Amount < 1){
				message.channel.sendMessage(`:x: You can't bet negative, ${message.author.username}.`);
				return;
			}

			if(Amount > stats.bal){
				message.channel.sendMessage(`:x: You don't have enough coins to bet that much, ${message.author.username}.`);
				return;
			}

			let Num = [1, 6].rInt();

			userGame.removeCoins(Amount).then(() => {
				let win = 0;
				if(Num === 4){
					win = Amount;
				}else if(Num === 5){
					win = Amount*1.5;
				}else if(Num === 6){
					win = Amount*2;
				}

				let Rolled = `:game_die: Rolled ${Num}.`;

				userGame.addGame().then(() => {
					if(win <= 0){
						userGame.addLoss().then(() => {
							message.channel.sendMessage(`${Rolled}\n\n:money_with_wings: You didn't win anything.`)
						});
					}else{
						userGame.addWin().then(() => {
							userGame.addCoins(win).then(() => {
								message.channel.sendMessage(`${Rolled}\n\n:moneybag: You won ${win.formatNumber()} coins!`);
							}).catch((e) => {
								MackBot.sendError(message, e);
							});
						}).catch((e) => {
							MackBot.sendError(message, e);
						});
					}
				}).catch((e) => {
					MackBot.sendError(message, e);
				});

			}).catch((e) => {
				MackBot.sendError(message, e);
			});
		}).catch((e) => {
			MackBot.sendError(message, e);
		});
	},
	Description: "Rolls the dice!",
	Usage: "`[Amount]`",
	Cooldown: 10,
	Extra: {
		"Win__table": ["`4: 1x`", "`5: 1.5x`", "`6: 2x`"]
	}
}
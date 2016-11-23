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

			let Chars = [
				":cherries:", ":cherries:", ":cherries:", ":cherries:", ":cherries:", ":cherries:",
				":lemon:", ":lemon:", ":lemon:", ":lemon:", ":lemon:",
				":tangerine:", ":tangerine:", ":tangerine:", ":tangerine:",
				":banana:",  ":banana:", ":banana:",
				":eggplant:", ":eggplant:",
				":gem:",
				":black_joker:"
			].shuffle();

			userGame.removeCoins(Amount).then(() => {
				let win = 0;
				
				let Line1 = [];
				let Line2 = [];
				let Line3 = [];

				let mArr = [];

				for(let line=0;line<3;line++){
					for(let col=0;col<3;col++){
						if(line === 0){
							Line1.push(Chars.random());
						}else if(line === 1){
							Line2.push(Chars.random());
						}else{
							Line3.push(Chars.random());
						}
					}
				}

				mArr.push(Line1.join(""));
				mArr.push(Line2.join(""));
				mArr.push(Line3.join(""));

				switch(Line2.join("")){
					case ":cherries::cherries::cherries:":
						win = Amount;
					break;
					case ":lemon::lemon::lemon:":
						win = Amount*1.25;
					break;
					case ":tangerine::tangerine::tangerine:":
						win = Amount*1.5;
					break;
					case ":banana::banana::banana:":
						win = Amount*1.75;
					break;
					case ":eggplant::eggplant::eggplant:":
						win = Amount*2;
					break;
					case ":gem::gem::gem:":
						win = Amount*2.25;
					break;
					case ":black_joker::black_joker::black_joker:":
						win = Amount*2.5;
					break;
					default:
						win = 0;
					break;
				}

				let Rolled = `:slot_machine: ${mArr.join("\n")}`;

				userGame.addGame().then(() => {
					if(win <= 0){
						userGame.addLoss().then(() => {
							message.channel.sendMessage(`${Rolled}\n\n:money_with_wings: You didn't win anything.`)
						});
					}else{
						userGame.addWin().then(() => {
							userGame.addCoins(win).then(() => {
								message.channel.sendMessage(`${Rolled}\n\n:moneybag: You won ${win.formatNumber()} coins!`);
							});
						});
					}
				});

			});

		})
	},
	Description: "Spins the slots! Three in a row in the middle gives a win!",
	Usage: "`[Amount]`",
	Cooldown: 10
}
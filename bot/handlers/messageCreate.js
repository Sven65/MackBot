module.exports = {
	Handle: (message) => {
		if(message.author.bot) return;

		let SId = "0";

		if(message.channel.type === "text"){
			SId = message.guild.id;
		}

		let Guild = new Server.Server(SId);

		Guild.exists.then((exists) => {
			if(!exists) Guild.create();
		
			let Args = message.content.replace(/\s\s+/g, " ").split(" ");

			Guild.prefix.then((prefix) => {
				Guild.toggled.then((toggled) => {
					if(Args[0].startsWith(prefix)){

						let user = new User.User(message.author.id);

						let command = Args[0].replace(prefix, "").toLowerCase();
						if(toggled.indexOf(command) > -1) return;
						
						if(MackBot.Commands.All.indexOf(command) > -1){
							try{
								user.isFirstTime(command).then((FirstTime) => {
									user.getLastExec(command).then((lastExecTime) => {
										let now = new Date().valueOf();
										if(now <= lastExecTime+MackBot.CommandHelper.resolveCooldown(command)*1000 && FirstTime){
											let time = Math.round(((lastExecTime + MackBot.CommandHelper.resolveCooldown(command) * 1000) - now) / 1000);
											message.channel.sendMessage(`You need to calm down, ${message.author.username}. :hourglass: ${time} seconds`);
										}else{
											try{
												Args.shift();
												MackBot.CommandHelper.resolveCommand(command).Execute(Args, message);
												user.setFirstTime(command, true).then(() => {
													user.setLastExec(command, now).then(() => {

													});
												})
											}catch(e){
												MackBot.SendError(message,e);
											}
										}
									}).catch((e) => {
										MackBot.SendError(message, e);
									});
								}).catch((e) => {
									MackBot.SendError(message, e);
								});
							}catch(e){
								MackBot.SendError(message, e);
							}
						}
					}
				}).catch((e) => {
					MackBot.SendError(message, e);
				});
			}).catch((e) => {
				MackBot.SendError(message, e);
			});
		}).catch((e) => {
			MackBot.SendError(message, e);
		});
	}
}
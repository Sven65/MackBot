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
					let prefixType = -1; // -1: None, 0: Standard, 1: Username, 2: Mention

					let command = "";

					if(Args[0].startsWith(prefix)){
						prefixType = 0;
						command = Args[0].replace(prefix, "").toLowerCase();
					}else if(Args[0].toLowerCase() === MackBot.user.username.toLowerCase()){
						prefixType = 1;
						Args.shift();
						command = Args[0].toLowerCase();
					}else if(message.isMentioned(MackBot.user)){
						prefixType = 2;
						Args.shift();
						command = Args[0].toLowerCase();
					}



					if(prefixType >= 0){

						let user = new User.User(message.author.id);
						
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
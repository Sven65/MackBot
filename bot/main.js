const Discord = require("discord.js");
const fs = require("fs");
const Config = require(`${__dirname}/Config.json`);
const rethink = require("rethinkdb");
const Handlers = require(`${__dirname}/handlers/index.js`);
const Extends = require(`${__dirname}/extends/extends.js`);

global.Server = require(`${__dirname}/utils/server/index.js`);
global.User = require(`${__dirname}/utils/user/index.js`);


let Commands = {
	All: [],
	List: {},
	Map: {}
};


const CommandHelper = {
	resolveCommand: (command) => {
		return Commands.List[Commands.Map[command]][command];
	},
	resolveCooldown: (command) => {
		return Commands.List[Commands.Map[command]][command].cooldown;
	},
	loadCommands: () => {
		return new Promise((resolve, reject) => {
			try{
				let Files = fs.readdirSync(__dirname+"/Commands");
				for(let File of Files){
					let stats = fs.lstatSync(__dirname+"/Commands/"+File);
					if(!stats.isDirectory()){
						if(File.endsWith('.js')){
							try{
								if(Commands.List["Other"] === undefined){
									Commands.List["Other"] = {};
								}
								Commands.List["Other"][File.slice(0, -3).toLowerCase()] = require(__dirname+'/Commands/'+File);
								Commands.All.push(File.slice(0, -3).toLowerCase());
								Commands.Map[File.slice(0, -3).toLowerCase()] = "Other";
								console.log("Loading "+File);
							}catch(e){
								console.dir(e);
								reject(e);
							}
						}
					}else{
						let DirFiles = fs.readdirSync(__dirname+"/Commands/"+File);
						for(let DirFile of DirFiles){
							if(DirFile.endsWith('.js')){
								try{
									if(Commands.List[File] === undefined){
										Commands.List[File] = {};
									}
									Commands.List[File][DirFile.slice(0, -3).toLowerCase()] = require(__dirname+'/Commands/'+File+"/"+DirFile);
									Commands.All.push(DirFile.slice(0, -3).toLowerCase());
									Commands.Map[DirFile.slice(0, -3).toLowerCase()] = File;
								}catch(e){
									console.dir(e);
									reject(e);
								}
							}
						}
					}
				}
				resolve();
			}catch(e){
				reject(e);
			}
		});
	}
}

let MackBot = new Discord.Client({
	autoReconnect: true,
	disableEveryone: true
});

rethink.connect({
	host: "localhost",
	port: 28015,
	user: Config.db.user,
	password: Config.db.pass
}, (err, conn) => {
	if(err) throw err;
	conn.use("MackBot");
	MackBot.rdb = {r: rethink, conn: conn};
	MackBot.Config = Config;
	CommandHelper.loadCommands().then(() => {
		MackBot.Commands = Commands;
		MackBot.CommandHelper = CommandHelper;
		MackBot.login(Config.Token).then(() => {
			global.MackBot = MackBot;
			console.log("Logged in");
		}).catch((e) => {
			throw e;
		});
	}).catch((e) => {
		console.log(e.stack);
	});
});

MackBot.on("message", message => Handlers.messageCreate.Handle(message));
module.exports = class User{
	constructor(id){
		this.id = id;
	}

	getLastExec(command){
		let now = new Date().valueOf();
		return MackBot.rdb.r.table("Cooldowns").get(this.id)(command).default(now).run(MackBot.rdb.conn);
	}

	setLastExec(command, exec){
		let data = {id: this.id};
		data[command] = exec;
		return MackBot.rdb.r.table("Cooldowns").insert(data, {conflict: "update"}).run(MackBot.rdb.conn);
	}

	isFirstTime(command){
		return MackBot.rdb.r.table('FirstTime').get(this.id)(command).default(false).run(MackBot.rdb.conn);
	}

	setFirstTime(command, time){
		let data = {id: this.id};
		data[command] = time;
		return MackBot.rdb.r.table('FirstTime').insert(data, {conflict: "update"}).run(MackBot.rdb.conn);
	}

	ignore(){
		return MackBot.rdb.r.table("Ignored").insert(this.id).run(MackBot.rdb.conn);
	}

	unignore(){
		return MackBot.rdb.r.table("Ignored").get(this.id).delete().run(MackBot.rdb.conn);
	}

	get isIgnored(){
		return MackBot.rdb.r.table('Ignored').get(this.id).default(null).run(MackBot.rdb.conn);
	}
}
module.exports = class Server{
	constructor(id){
		this.id = id;
	}

	create(){
		let data = {id: this.id, prefix: "§"};
		return MackBot.rdb.r.table("Servers").insert(data).run(MackBot.rdb.conn);
	}

	setPrefix(prefix){
		return MackBot.rdb.r.table("Servers").get(this.id).update({prefix: prefix}).run(MackBot.rdb.conn);
	}

	get prefix(){
		return MackBot.rdb.r.table("Servers").get(this.id)("prefix").default("§").run(MackBot.rdb.conn);
	}

	get exists(){
		let id = this.id;
		return MackBot.rdb.r.table("Servers").filter(function(server){
			return server("id").eq(id)
		}).isEmpty().not().default(false).run(MackBot.rdb.conn);
	}

	get toggled(){
		return MackBot.rdb.r.table("Servers").get(this.id)("toggled").default([]).run(MackBot.rdb.conn);
	}

	toggleOn(command){
		let Data = {toggled: []};
		Data.toggled = MackBot.rdb.r.row("toggled").default([]).append(command);
		return MackBot.rdb.r.table("Servers").get(this.id).update(Data).run(MackBot.rdb.conn);
	}

	toggleOff(command){
		let Data = {toggled: []};
		Data.toggled = MackBot.rdb.r.row("toggled").default([]).difference(command);
		return MackBot.rdb.r.table("Servers").get(this.id).update(Data).run(MackBot.rdb.conn);
	}
}
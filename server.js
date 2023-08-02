require("dotenv").config();
const {
	postgres: { sequelize },
} = require("./lib/databases");
const config = require("config");
const serverConfig = config.get("server");

process.on("uncaughtException", (ex) => {
	console.log(ex)
	// throw ex;
});
process.on("unhandledRejection", (ex) => {
	console.log(ex)
	// throw ex;
});

const app = require("./lib/app");

sequelize
	.sync(config.get("databases.postgres.sync"))
	.then(async () => {
		console.log(`*** POSTGRES Info: Tables are synced!`);

		let server = app.listen(serverConfig.port, () => {
			console.log(`*** SERVER Info: Server is running on port ${serverConfig.port}...`);
		});

		// register db triggers
		require("./lib/databases/postgres/init")().then(() => {
			require("./lib/services/watcher.service").init();
		});


	})
	.catch((e) => {
		console.log(e);

		throw e;
	});

module.exports =  ({ env }) => ({
	connection: {
		client: 'postgres',
		connection: {
		host: env('DATABASE_HOST', 'localhost'),
			port: env.int('DATABASE_PORT', 5432),
			database: env('DATABASE_NAME', 'shipitlive'),
			user: env('DATABASE_USERNAME', 'shipitlive'),
			password: env('DATABASE_PASSWORD', 'shipitlive'),
			ssl: env.bool('DATABASE_SSL', false)
		}
	}
});

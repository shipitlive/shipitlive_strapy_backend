module.exports = ({ env }) => {
  const client = env("DATABASE_CLIENT", "pg");

  const connections = {
    postgres: {
      connection: {
        host: env("DATABASE_HOST", "postgres-strapi-postgresql"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "shipitlive"),
        user: env("DATABASE_USERNAME", "shipitlive"),
        password: env("DATABASE_PASSWORD", "shipitlive"),
        ssl: {
          rejectUnauthorized: false,
        },
        schema: env("DATABASE_SCHEMA", "public"),
      },
      pool: {
        min: env.int("DATABASE_POOL_MIN", 2),
        max: env.int("DATABASE_POOL_MAX", 10),
      },
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000),
    },
  };
};

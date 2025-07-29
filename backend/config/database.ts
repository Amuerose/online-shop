export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('PGHOST'),
      port: env.int('PGPORT', 5432),
      database: env('PGDATABASE', 'strapi'),
      user: env('PGUSER', 'strapi'),
      password: env('PGPASSWORD', 'strapi'),
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: { min: 0, max: 10 },
  },
});

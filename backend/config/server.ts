export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env('APP_KEYS', 'keyA,keyB').split(','),
  },
  admin: {
    auth: {
      secret: env('JWT_SECRET'),
    },
  },
});

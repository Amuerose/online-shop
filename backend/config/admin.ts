export default ({ env }) => {
  console.log('🧪 ADMIN_JWT_SECRET:', env('ADMIN_JWT_SECRET'));

  return {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'dev-backup-secret'),
    },
    apiToken: {
      salt: env('API_TOKEN_SALT'),
    },
    transfer: {
      token: {
        salt: env('TRANSFER_TOKEN_SALT'),
      },
    },
    secrets: {
      encryptionKey: env('ENCRYPTION_KEY'),
    },
    flags: {
      nps: env.bool('FLAG_NPS', true),
      promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },
  };
};

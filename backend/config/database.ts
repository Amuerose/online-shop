import path from 'path';

export default () => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: path.join(__dirname, '..', '..', 'data.db'),
    },
    useNullAsDefault: true,
  },
});

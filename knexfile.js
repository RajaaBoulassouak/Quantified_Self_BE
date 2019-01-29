// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/quantified_self_be',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'postgresql',
    connection: 'postgres://yvooihzyqtlsie:c8ed3ce281da5e0ba9632976630588e8496fc14c08fd8edb155d0451dc50eb87@ec2-107-21-224-76.compute-1.amazonaws.com:5432/dafu7taifspd4f',
    migrations: {
      tableName: 'knex_migrations'
    }
    ssl: true
  }
};

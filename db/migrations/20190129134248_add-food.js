exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('foods', function(table) {
      table.increments('id').primary();
      table.string('title');
      table.integer('calories').unsigned();

      table.timestamps(true, true);
    }),
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('foods')
  ]);
};
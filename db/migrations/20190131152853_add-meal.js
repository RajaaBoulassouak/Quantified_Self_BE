exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('meals', function(table) {
      table.increments('id').primary();
      table.string('type');
      table.integer('goal_calories').unsigned();
      
      table.timestamps(true, true);
    }),
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('meals')
  ]);
};


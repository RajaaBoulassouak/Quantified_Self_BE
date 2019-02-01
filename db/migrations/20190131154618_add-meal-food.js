exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('meal-foods', function(table) {
      table.increments('id').primary();
      table.integer('meal_id').unsigned()
      table.foreign('meal_id').references('meals.id');
      table.integer('food_id').unsigned()
      table.foreign('food_id').references('foods.id');
      
      table.timestamps(true, true);
    }),
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('meal-foods')
  ]);
};
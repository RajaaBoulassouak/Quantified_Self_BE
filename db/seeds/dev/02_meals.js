exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE meals RESTART IDENTITY CASCADE')
  .then(function () {
    return knex('meals').insert([
      { type: 'Breakfast', goal_calories: 650 },
      { type: 'Lunch', goal_calories: 650 },
      { type: 'Dinner', goal_calories: 500 },
      { type: 'Snack', goal_calories: 200 }
    ])
    .then(() => console.log('Seeding complete!'))
    .catch(error => console.log(`Error seeding data: ${error}`))
  })
  .catch(error => console.log(`Error seeding data: ${error}`));
};
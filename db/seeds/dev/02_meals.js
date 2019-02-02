exports.seed = function(knex, Promise) {
  return knex('meals').del()
  .then(() => {
    return Promise.all([
      knex('meals').insert([
        { id: 1, type: 'Breakfast', goal_calories: 650 },
        { id: 2, type: 'Lunch', goal_calories: 650 },
        { id: 3, type: 'Dinner', goal_calories: 500 },
        { id: 4, type: 'Snack', goal_calories: 200 }
      ])
      .then(() => console.log('Seeding complete!'))
      .catch(error => console.log(`Error seeding data: ${error}`))
    ])
  })
  .catch(error => console.log(`Error seeding data: ${error}`));
};
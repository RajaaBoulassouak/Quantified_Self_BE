exports.seed = function(knex, Promise) {
  return knex('meal-foods').del() 
  .then(() => {
    return Promise.all([
      knex('meal-foods').insert([
        { id: 1, meal_id: 1, food_id: 1 },
        { id: 2, meal_id: 1, food_id: 2 },
        { id: 3, meal_id: 2, food_id: 1 },
        { id: 4, meal_id: 2, food_id: 2 },
        { id: 5, meal_id: 3, food_id: 1 },
        { id: 6, meal_id: 3, food_id: 2 },
        { id: 7, meal_id: 4, food_id: 1 },
        { id: 8, meal_id: 4, food_id: 2 }
      ])
      .then(() => console.log('Seeding complete!'))
      .catch(error => console.log(`Error seeding data: ${error}`))
    ])
  })
  .catch(error => console.log(`Error seeding data: ${error}`));
};
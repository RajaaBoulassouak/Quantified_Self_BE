exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE foods RESTART IDENTITY CASCADE')
  .then(function () {
    return knex('foods').insert([
      { title: 'Banana', calories: 105 },
      { title: 'Apple', calories: 95 },
      { title: '200g Steak', calories: 542 },
      { title: '1 Serving Broccoli', calories: 50 },
      { title: '50g Nuts', calories: 300 },
      { title: '100g Cheese', calories: 200 },
      { title: 'Chicken Soup', calories: 160 },
      { title: 'Garden Salad', calories: 500 }
    ])
    .then(() => console.log('Seeding complete!'))
    .catch(error => console.log(`Error seeding data: ${error}`))
  })
  .catch(error => console.log(`Error seeding data: ${error}`));
};
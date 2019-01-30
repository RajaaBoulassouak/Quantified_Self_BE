
exports.seed = function(knex, Promise) {
  return knex('foods').del()
  .then(() => {
    return Promise.all([
      knex('foods').insert([
        { id: 1, title: 'Banana', calories: 105 },
        { id: 2, title: 'Apple', calories: 95 }
      ])
      .then(() => console.log('Seeding complete!'))
      .catch(error => console.log(`Error seeding data: ${error}`))
    ])
  })
  .catch(error => console.log(`Error seeding data: ${error}`));
};
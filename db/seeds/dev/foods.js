
exports.seed = function(knex, Promise) {
  return knex('foods').del()
  .then(() => {
    return Promise.all([
      knex('foods').insert([
        { title: 'Banana', calories: 95 },
        { title: 'Apple', calories: 105 }
      ])
      .then(() => console.log('Seeding complete!'))
      .catch(error => console.log(`Error seeding data: ${error}`))
    ])
  })
  .catch(error => console.log(`Error seeding data: ${error}`));
};
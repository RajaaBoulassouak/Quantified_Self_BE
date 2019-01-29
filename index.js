const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Quantified-Self-BE';

app.post('/api/v1/foods', (request, response) => {
  const food = request.body;

  for (let requiredParameter of ['title', 'calories']) {
    if (!food[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { title: <String>, calories: <Integer> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('foods').insert(food, 'id')
    .then(food => {
      response.status(201).json({ id: food[0], title: food[1], calories: food[2] })
    })
    .catch(error => {
      response.status(400).json({ error });
    });
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
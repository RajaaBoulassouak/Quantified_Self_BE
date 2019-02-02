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
      return response.status(422).send({ 
        error: `Expected format: { title: <String>, calories: <Integer> }. You're missing a "${requiredParameter}" property.` 
      });
    }
  }                           
  database('foods').insert(food, '*')
  .then(food => {
    response.status(201).json({ food })
  })
  .catch(error => {
    response.status(400).json({ error });
  });
});

app.patch('/api/v1/foods/:id', (request, response) => {
  const food = request.body;
  for (let requiredParameter of ['title', 'calories']) {
    if (!food[requiredParameter]) {
      return response.status(422).send({ 
        error: `Expected format: { title: <String>, calories: <Integer> }. You're missing a "${requiredParameter}" property.` 
      });
    }
  } 
  database('foods').where('id', request.params.id)
  .update({title: food.title, calories: food.calories}, '*')
  .then(food => {
    response.status(200).json({
      message: 'Food updated!', food
    });
  })
  .catch((error) => {
    response.status(400).json({ error: 'Could not update food' });
  });
});      

app.get('/api/v1/foods', (request, response) => {
  database('foods').select()
  .then((foods) => {
    response.status(200).json(foods);
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/foods/:id', (request, response) => {
  database('foods').where('id', request.params.id).select()
  .then(foods => {
    if (foods.length) {
      response.status(200).json(foods);
    } else {
      response.status(404).json({ 
        error: `Could not find food with id ${request.params.id}` 
      });
    }
  })
  .catch(error => {
    response.status(500).json({ error });
  });
});

app.delete('/api/v1/foods/:id', (request, response) => {
  database('foods').where('id', request.params.id).delete()
  .then(foods => {
    if (foods == 1) {
      response.status(204).json({success: true});
    } else {
      response.status(404).json({ error });
      }
    })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/meals', (request, response) => {
  database('meals')
  .join('meal_foods', 'meal_foods.meal_id', '=', 'meals.id')
  .join('foods', 'meal_foods.food_id', '=', 'foods.id')
  .select('*')
  .then((meals) => {
    response.status(200).json(meals);
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/meals/:id/foods', (request, response) => {
  database('meals')
  .where('meals.id', request.params.id)
  .join('meal_foods', 'meal_foods.meal_id', '=', 'meals.id')
  .join('foods', 'meal_foods.food_id', '=', 'foods.id')
  .select('*')
  .then(foods => {
    let type = foods[0].type;
    let goal_calories = foods[0].goal_calories;
    let created_at = foods[0].created_at;
    let updated_at = foods[0].updated_at;
    let meal_foods = [];
    foods.forEach( (meal_food) => {
      meal_foods.push({'title': meal_food.title, 'calories': meal_food.calories})
    });
    if (foods.length) {
      response.status(200).json({
        'id': request.params.id, 
        'meal_type': type,
        'goal_calories': foods[0].goal_calories,
        'created_at': created_at,
        'updated_at': updated_at,
        'foods': meal_foods
      })
    } else {
      response.status(404).json({ 
        error: `Could not find food with id ${request.params.id}` 
      });
    }
  })
  .catch(error => {
    response.status(500).json({ error });
  });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const pry = require('pryjs')

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
  database('foods')
  .insert(food, '*')
  .then(food => {
    response.status(201).json({ food })
  })
  .catch(error => {
    response.status(400).json({ 
      error: 'Could not create food.'
    });
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
  database('foods')
  .where('id', request.params.id)
  .update({ 
    title: food.title, 
    calories: food.calories 
    }, '*')
  .then(food => {
    response.status(200).json({
      message: 'Food updated!', food
    });
  })
  .catch((error) => {
    response.status(400).json({ 
      error: 'Could not update food' 
    });
  });
});      


app.get('/api/v1/foods', (request, response) => {
  database('foods')
  .select()
  .then((foods) => {
    response.status(200).json(foods);
  })
  .catch((error) => {
    response.status(500).json({ 
      error: 'Something went wrong' 
    });
  });
});


app.get('/api/v1/foods/:id', (request, response) => {
  database('foods')
  .where('id', request.params.id)
  .select()
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
    response.status(500).json({ 
      error: 'Something went wrong' 
    });
  });
});


app.delete('/api/v1/foods/:id', (request, response) => {
  database('foods')
  .where('id', request.params.id)
  .select()
  .then(foods => {
    if (!foods.length) {
      return response.status(404).json({ 
        error: `Could not find food with id ${request.params.id}` 
      });
    } 
  })
  database('foods')
  .where('id', request.params.id)
  .delete()
  .then(foods => {
    if (foods == 1) {
      response.status(204).json({ 
        success: true 
      });
    }
  })
  .catch((error) => {
    response.status(500).json({ 
      error: 'Something went wrong' 
    });
  });
});


app.get('/api/v1/meals', (request, response) => {
  database('meals')
  .select('*')
  .then((meals) => {
    response.status(200).json(meals);
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});

app.get('/api/v1/meal_foods', (request, response) => {
  database('meal_foods')
  .select('*')
  .then((meal_foods) => {
    response.status(200).json(meal_foods);
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});


app.get('/api/v1/meals/:meal_id/foods', (request, response) => {
  database('meals')
  .where('meals.id', request.params.meal_id)
  .join('meal_foods', 'meal_foods.meal_id', '=', 'meals.id')
  .join('foods', 'meal_foods.food_id', '=', 'foods.id')
  .select('*')
  .then(foods => {
    if (!foods.length) {
      response.status(404).json({ 
        error: `Could not find food with id ${request.params.meal_id}` 
      });
    } else {
      let type = foods[0].type;
      let goal_calories = foods[0].goal_calories;
      let created_at = foods[0].created_at;
      let updated_at = foods[0].updated_at;
      let meal_foods = [];
      foods.forEach( (meal_food) => {
        meal_foods.push({ 
          'id': meal_food.food_id, 
          'title': meal_food.title, 
          'calories': meal_food.calories 
        })
      });
      response.status(200).json({
        'id': parseInt(request.params.meal_id), 
        'meal_type': type,
        'goal_calories': foods[0].goal_calories,
        'created_at': created_at,
        'updated_at': updated_at,
        'foods': meal_foods
      })
    }
  })
  .catch(error => {
    response.status(500).json({ 
      error: 'Something went wrong' 
    });
  });
});   


app.post('/api/v1/meals/:meal_id/foods/:id', (request, response) => {  
  database('meals')
  .where('meals.id', request.params.meal_id)
  .select()
  .then(meal => {
    if (!meal.length) {
      return response.status(404).json({ 
        error: `Could not find meal with id ${request.params.meal_id}` 
      });
    }
  });
  database('foods')
  .where('foods.id', request.params.id)
  .select()
  .then(food => { 
    if (!food.length) {
      return response.status(404).json({ 
        error: `Could not find food with id ${request.params.id}` 
      });
    }
  }) 
  database('meal_foods')
  .insert({ 
    meal_id: request.params.meal_id, 
    food_id: request.params.id 
  })
  .then(() => {
    database('meal_foods')
    .where('meals.id', request.params.meal_id)
    .where('foods.id', request.params.id)
    .join('meals', 'meal_foods.meal_id', '=', 'meals.id')
    .join('foods', 'meal_foods.food_id', '=', 'foods.id')
    .select('*')
    .limit(1)
    .then(meal_foods => {
      response.status(201).json({ 
        "message": `Successfully added ${meal_foods[0].title} to ${meal_foods[0].type}` 
      })
    }) 
  })                    
  .catch(error => {
    response.status(500).json({ 
      error: 'Something went wrong' 
    });
  });
});


app.delete('/api/v1/meals/:meal_id/foods/:id', (request, response) => { 
  database('meal_foods')
  .where('meal_id', request.params.meal_id)
  .where('food_id', request.params.id)
  .join('meals', 'meal_foods.meal_id', '=', 'meals.id')
  .join('foods', 'meal_foods.food_id', '=', 'foods.id')
  .select()
  .then(meal_foods => {
    if (!meal_foods.length) {
      return response.status(404).json({ 
        error: `Could not find record with meal id  ${request.params.meal_id} and food id ${request.params.id}` 
      });
    } else {
      meal_foods
      .delete()
      .then(meal_foods => {
        if (!meal_foods.length) {
          response.status(204).json({ 
            success: true 
          });
        }
      })
    }
  })
  .catch((error) => {
    response.status(500).json({ 
      error: 'Something went wrong' 
    });
  });
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app
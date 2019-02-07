const express = require('express');
const cors = require('cors')
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
app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin",
    "*");
  response.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  response.header("Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});


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
    database.raw(
      `SELECT meals.id, meals.type, meals.goal_calories, meals.created_at, meals.updated_at, array_to_json (array_agg(json_build_object('id', foods.id, 'title', foods.title, 'calories', foods.calories, 'created_at', foods.created_at, 'updated_at', foods.updated_at)))
      AS foods
      FROM meals
      JOIN meal_foods ON meal_foods.meal_id = meals.id
      JOIN foods ON meal_foods.food_id = foods.id
      GROUP BY meals.id
      ORDER BY meals.id ASC`
    )
    .then((meals) => {
    response.status(200).json(meals.rows);
  })
  .catch((error) => {
    response.status(500).json({ error });
  });
});


app.patch('/api/v1/meals/:id', (request, response) => {
  const meal = request.body;
  
  for (let requiredParameter of ['goal_calories']) {
    if (!meal[requiredParameter]) {
      return response.status(422).send({ 
        error: `Expected format: { goal_calories: <Integer> }. You're missing a goal_calories property.` 
      });
    }
  } 
  database('meals')
  .where('id', request.params.id)
  .update({ 
    goal_calories: meal.goal_calories 
    }, '*')
  .then(meal => {
    response.status(200).json({
      message: 'Meal updated successfully!', meal
    });
  })
  .catch((error) => {
    response.status(400).json({ 
      error: 'Could not update meal' 
    });
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
        error: `Could not find meal with id ${request.params.meal_id}` 
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
    .select()
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
        error: `Could not find record with meal id ${request.params.meal_id} and food id ${request.params.id}` 
      });
    } else {
      let food_title = meal_foods[0].title
      let meal_type = meal_foods[0].type
      database('meal_foods')
      .where('meal_id', request.params.meal_id)
      .where('food_id', request.params.id)
      .join('meals', 'meal_foods.meal_id', '=', 'meals.id')
      .join('foods', 'meal_foods.food_id', '=', 'foods.id')
      .delete()
      .then(meal_foods => {
        if (!meal_foods.length) {
          response.status(200).json({ 
            message: `Successfully removed ${food_title} from ${meal_type}`
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
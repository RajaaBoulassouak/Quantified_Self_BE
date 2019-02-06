# Quantified Self Back-End


This API is built with Express and it's designed to provide data for a seperate front-end app to consume it.  The front-end app allows the user to track their daily calorie consumption by setting calorie goals for the day, via defining goals for each meal!

* [See the deployed version on Heroku](https://protected-retreat-87261.herokuapp.com/)
* [Checkout the Front-End]()


## How to Use the API
1. Fork or clone this repo: `git@github.com:RajaaBoulassouak/Quantified_Self_BE.gi <name of your choice>`
1. To see the app in action locally: run `node index.js`
1. Use Postman or the deployed app to hit the availbale the endpoints


## Schema Design


## Available Endpoints
* ***GET /api/v1/foods***

  This returns all the foods currently in the database.
  
  
* GET /api/v1/foods/:id

  This returns the food object with the passed in `:id`.  
  If no food with the specific `:id` is found, a 404 status code will be returned.
  
  
* POST /api/v1/foods

  This allows creating a new food with the parameters:  
  `{ "food": { "title": "Name of food here", "calories": "Calories here as an integer"} }`  
  Both title and calories are required fields.  
  If the food is successfully created, the new food item will be returned.  
  If the food is not successfully created, a 400 status code will be returned.  
  
  
* PATCH /api/v1/foods/:id

  This allows updating an existing food with the parameters:  
  `{ "food": { "title": "Name of food here", "calories": "Calories here as an integer"} }`   
  Both title and calories are required fields.  
  If the food is successfully updated, the updated food item will be returned.  
  If the food is not successfully updated, a 400 status code will be returned.  
  
  
* DELETE /api/v1/foods/:id

  This Will delete the food with the passed in `:id`.  
  If the food is successfully deleted, a 204 status code will be returned.  
  If no food with the specific `:id` is found, a 404 status code will be returned.  
  
  
  
* GET /api/v1/meals 

  This returns all the meals currently in the database along with their associated foods.

* GET /api/v1/meals/:meal_id/foods
  
  This returns all the foods associated with the meal with the passed in `:meal_id`.  
  If no meal with the specific `:meal_id` is found, a 404 status code will be returned.
  
* POST /api/v1/meals/:meal_id/foods/:id

  This allows adding the food with `:id` to the meal with `:meal_id` by creating a new record in the MealFoods table to         establish the relationship between the food and the meal.  
  If the food is successfully added to the meal, a 201 status code will be returned.  
  If no meal with the specific `:meal_id` or no food with the specific `:id` are found, a 404 status code will be returned.

* DELETE /api/v1/meals/:meal_id/foods/:id

  This deletes the existing record in the MealFoods table that creates the relationship between the food with the `:id` and     the meal with the `meal_id`.  
  If the food is successfully removed from the meal, a 200 status code will be returned.  
  If no meal with the specific `:meal_id` or no food with the specific `:id` are found, a 404 status code will be returned.



## Running Tests
Sufficient testing is provided 

to run the tests execute `mocha --exit`


## How to Contribute
To contribute, see the setup instructions.
* [Open Issues](https://github.com/Kate-v2/Quantified_Self_FE/projects/1)
* Create a new branch describing the feature. If you close an issue, include it's number in the branch name.
* Please describe all changes in the Pull Request (to `Master`), and all relative issue cards/actions.
* Please use the Pull Request Template as the baseline for communication - feel free to add more!
* Please update the `README` if anything is affected.


## Core Contributors
* [Kate](https://github.com/Kate-v2)
* [Rajaa](https://github.com/RajaaBoulassouak)


## Technical

* [Express](https://expressjs.com/)
* [PostgreSQL](https://www.postgresql.org//)
* [JavaScript](https://www.javascript.com/)
* [Mocha](https://mochajs.org/)
* [Chai](https://chaijs.com/)


## Turing Project Details:
* [Assignment](http://backend.turing.io/module4/projects/quantified_self/quantified_self_full_stack)
* [Rubric](http://backend.turing.io/module4/projects/quantified_self/rubric)

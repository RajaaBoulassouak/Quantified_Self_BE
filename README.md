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
  ```
  [
    {
        "id": 1,
        "title": "Banana",
        "calories": 105,
        "created_at": "2019-02-05T22:45:08.319Z",
        "updated_at": "2019-02-05T22:45:08.319Z"
    },
    {
        "id": 2,
        "title": "Apple",
        "calories": 95,
        "created_at": "2019-02-05T22:45:08.319Z",
        "updated_at": "2019-02-05T22:45:08.319Z"
    },
    {
        "id": 3,
        "title": "200g Steak",
        "calories": 542,
        "created_at": "2019-02-05T22:45:08.319Z",
        "updated_at": "2019-02-05T22:45:08.319Z"
    }
  ]
  ```  
  
  
* ***GET /api/v1/foods/:id***

  This returns the food object with the passed in `:id`.  
  ```
  [
    {
        "id": 1,
        "title": "Banana",
        "calories": 105,
        "created_at": "2019-02-05T23:05:51.461Z",
        "updated_at": "2019-02-05T23:05:51.461Z"
    }
  ]
  ```
 
  If no food with the specific `:id` is found, a 404 status code will be returned.
  ```
  {
    "error": "Could not find food with id 100"
  }
  ```  
  
  
* ***POST /api/v1/foods***

  This allows creating a new food with the parameters:  
  `{ "food": { "title": "Name of food here", "calories": "Calories here as an integer"} }`  
  Both title and calories are required fields.  
  If the food is successfully created, the new food item will be returned.  
  If the food is not successfully created, a 400 status code will be returned.  
   ```
  {
    "message": "Food successfully created",
    "food": [
        {
            "id": 9,
            "title": "Acocado",
            "calories": 235,
            "created_at": "2019-02-06T01:01:12.112Z",
            "updated_at": "2019-02-06T01:01:12.112Z"
        }
     ]
  }
  ```  

  
* ***PATCH /api/v1/foods/:id***

  This allows updating an existing food with the parameters:  
  `{ "food": { "title": "Name of food here", "calories": "Calories here as an integer"} }`   
  Both title and calories are required fields.  
  If the food is successfully updated, the updated food item will be returned.  
  If the food is not successfully updated, a 400 status code will be returned.  
  ```
  {
    "message": "Food successfully updated!",
    "food": [
        {
            "id": 9,
            "title": "Mango",
            "calories": 200,
            "created_at": "2019-02-06T01:01:12.112Z",
            "updated_at": "2019-02-06T01:01:12.112Z"
        }
     ]
  }
  ```  
  
  
* ***DELETE /api/v1/foods/:id***

  This Will delete the food with the passed in `:id`.  
  If the food is successfully deleted, a 204 status code will be returned.  
  If no food with the specific `:id` is found, a 404 status code will be returned.  
  
  
* ***GET /api/v1/meals***

  This returns all the meals currently in the database along with their associated foods.
  ```
  [
     {
        "id": 1,
        "type": "Breakfast",
        "goal_calories": 650,
        "foods": [
            {
                "id": 1,
                "title": "Banana",
                "calories": 105
            },
            {
                "id": 2,
                "title": "Apple",
                "calories": 95
            }
        ]
     },
     {
        "id": 2,
        "type": "Lunch",
        "goal_calories": 650,
        "foods": [
            {
                "id": 3,
                "title": "200g Steak",
                "calories": 542
            },
            {
                "id": 4,
                "title": "1 Serving Broccoli",
                "calories": 50
            }
        ]
     },
     {
        "id": 3,
        "type": "Dinner",
        "goal_calories": 500,
        "foods": [
            {
                "id": 5,
                "title": "50g Nuts",
                "calories": 300
            },
            {
                "id": 6,
                "title": "100g Cheese",
                "calories": 200
            }
        ]
     },
     {
        "id": 4,
        "type": "Snack",
        "goal_calories": 200,
        "foods": [
            {
                "id": 7,
                "title": "Chicken Soup",
                "calories": 160
            },
            {
                "id": 8,
                "title": "Garden Salad",
                "calories": 500
            }
        ]
     }
  ]
  ```

* ***GET /api/v1/meals/:meal_id/foods***

  This returns all the foods associated with the meal with the passed in `:meal_id`.  
   ```
   {
    "id": 1,
    "meal_type": "Breakfast",
    "goal_calories": 650,
    "created_at": "2019-02-05T23:05:51.461Z",
    "updated_at": "2019-02-05T23:05:51.461Z",
    "foods": [
        {
            "id": 1,
            "title": "Banana",
            "calories": 105
        },
        {
            "id": 2,
            "title": "Apple",
            "calories": 95
        }
      ]
   }
  ```
  If no meal with the specific `:meal_id` is found, a 404 status code will be returned.
  ```
  {
    "error": "Could not find meal with id 100"
  }
  ```  
  
  
* ***POST /api/v1/meals/:meal_id/foods/:id***

  This allows adding the food with `:id` to the meal with `:meal_id` by creating a new record in the MealFoods table to         establish the relationship between the food and the meal.  
  If the food is successfully added to the meal, a 201 status code will be returned.
  ```
  {
    "message": "Successfully added Mango to Breakfast"
  }
  ```  
  
  If no meal with the specific `:meal_id` or no food with the specific `:id` are found, a 404 status code will be returned.
  ```
  {
    "error": "Could not find meal with id 50"
  }
  ```
  ```
  {
    "error": "Could not find food with id 50"
  }
  ```


* ***DELETE /api/v1/meals/:meal_id/foods/:id***

  This deletes the existing record in the MealFoods table that creates the relationship between the food with the `:id` and     the meal with the `meal_id`.  
  If the food is successfully removed from the meal, a 200 status code will be returned.  
  ```
  {
    "message": "Successfully removed Mango from Breakfast"
  }
  ```  
  If no meal with the specific `:meal_id` or no food with the specific `:id` are found, a 404 status code will be returned.
  ```
  {
    "error": "Could not find record with meal id 50 and food id 100"
  }
  ``` 

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
* [Rajaa](https://github.com/RajaaBoulassouak)
* [Kate](https://github.com/Kate-v2)


## Technical

* [Express](https://expressjs.com/)
* [PostgreSQL](https://www.postgresql.org//)
* [JavaScript](https://www.javascript.com/)
* [Mocha](https://mochajs.org/)
* [Chai](https://chaijs.com/)


## Turing Project Details:
* [Assignment](http://backend.turing.io/module4/projects/quantified_self/quantified_self_full_stack)
* [Rubric](http://backend.turing.io/module4/projects/quantified_self/rubric)

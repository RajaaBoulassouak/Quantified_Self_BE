const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../index');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
chai.use(chaiHttp);

describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
    .then(() => done())
    .catch(error => {
      throw error;
    });
  });

  beforeEach((done) => {
    database.seed.run()
    .then(() => done())
    .catch(error => {
      throw error;
    });
  });
  
  after((done) => {
    database.seed.run()
    .then(() => done())
    .catch(error => {
      throw error;
    });
  });
  
  
  describe('POST /api/v1/foods', () => {
    it('should CREATE a new food', done => {
      chai.request(server)
      .post('/api/v1/foods')
      .send({
        title: 'Orange',
        calories: 45
      })
      .end((error, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.food[0].should.have.property('id');
        response.body.food[0].should.have.property('title');
        response.body.food[0].title.should.equal('Orange');
        response.body.food[0].should.have.property('calories');
        response.body.food[0].calories.should.equal(45);
        done();
      });
    });
  
    it('should NOT CREATE a new food if missing any of the attributes', done => {
      chai.request(server)
      .post('/api/v1/foods')
      .send({
        title: 'Orange',
      })
      .end((error, response) => {
        response.should.have.status(422);
        response.body.error.should.equal(
          `Expected format: { title: <String>, calories: <Integer> }. You're missing a "calories" property.`
        );
        done();
      });
    });
  });
  
  
  describe('PATCH /api/v1/foods/:id', () => {
    it('should UPDATE a food given the id', (done) => {
      chai.request(server)
      .patch('/api/v1/foods/1')
      .send({ title: 'Orange', calories: 45 })
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.have.property('message');
        response.body.message.should.equal('Food updated!');
        response.body.food[0].id.should.equal(1);
        response.body.food[0].title.should.equal('Orange');
        response.body.food[0].calories.should.equal(45);
        done();
      });
    });
  
    it('should NOT UPDATE the food if missing any of the attributes', done => {
      chai.request(server)
      .patch('/api/v1/foods/1')
      .send({
        calories: 45
      })
      .end((error, response) => {
        response.should.have.status(422);
        response.body.error.should.equal(
          `Expected format: { title: <String>, calories: <Integer> }. You're missing a "title" property.`
        );
        done();
      });
    });
  });
  
  
  describe('GET /api/v1/foods', () => {
    it('should return ALL of the foods', done => {
      chai.request(server)
      .get('/api/v1/foods')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(8);
        response.body[0].should.have.property('title');
        response.body[0].title.should.equal('Banana');
        response.body[0].should.have.property('calories');
        response.body[0].calories.should.equal(105);
        done();
      });
    });
  });
  
  
  describe('GET /api/v1/foods/:id', () => {
    it('should return A FOOD given the id', done => {
      chai.request(server)
      .get('/api/v1/foods/1')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('title');
        response.body[0].title.should.equal('Banana');
        response.body[0].should.have.property('calories');
        response.body[0].calories.should.equal(105);
        done();
      });
    });
  
    it('should return 404 if food with given id is not found', done => {
      chai.request(server)
      .get('/api/v1/foods/100')
      .end((error, response) => {
       response.should.have.status(404);
       response.should.be.json;
       response.body.should.have.property('error');
       response.body.error.should.equal('Could not find food with id 100');
       done();
      });
    });
  });
  
  
  describe('DELETE /api/v1/foods/:id', () => {
    it('should DELETE a food given the id', (done) => {
      chai.request(server)
      .delete('/api/v1/foods/1')
      .end((error, response) => {
        response.should.have.status(204);
        chai.request(server)
        .get('/api/v1/foods/1')
        .end((error, response) => {
          response.should.have.status(404);
          done();
        });
      });
    });
    
    it('should return 404 if food with given id is not found', done => {
      chai.request(server)
      .delete('/api/v1/foods/100')
      .end((error, response) => {
       response.should.have.status(404);
       response.should.be.json;
       response.body.should.have.property('error');
       response.body.error.should.equal('Could not find food with id 100');
       done();
      });
    });
  });
  
  
  describe('GET /api/v1/meals', () => {
   it('should return ALL of the meals', done => {
      chai.request(server)
      .get('/api/v1/meals')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(4);
        response.body[0].should.have.property('type');
        response.body[0].type.should.equal('Breakfast');
        response.body[0].should.have.property('goal_calories');
        response.body[0].goal_calories.should.equal(650)
        response.body[0].should.have.property('foods');
        response.body[0].foods.should.be.a('array');
        response.body[0].foods.length.should.equal(2);
        done();
      });
    });
  });
  
  describe('PATCH /api/v1/meals/:id', () => {
    it('should UPDATE a meal given the id', (done) => {
      chai.request(server)
      .patch('/api/v1/meals/1')
      .send({ goal_calories: 800 })
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.have.property('message');
        response.body.message.should.equal('Meal updated successfully!');
        
        response.body.meal[0].id.should.equal(1);
        response.body.meal[0].goal_calories.should.equal(800);
        done();
      });
    });
  
    it('should NOT UPDATE the meal if missing the goal_calories attribute', done => {
      chai.request(server)
      .patch('/api/v1/meals/1')
      .send({ })
      .end((error, response) => {
        response.should.have.status(422);
        response.body.error.should.equal(
          `Expected format: { goal_calories: <Integer> }. You're missing a goal_calories property.`
        );
        done();
      });
    });
  });
  
  
  describe('GET /api/v1/meals/:meal_id/foods', () => {
    it('should return A MEAL and its associated FOODS given the meal id', done => {
      chai.request(server)
      .get('/api/v1/meals/1/foods')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('id');
        response.body.id.should.equal(1);
        response.body.should.have.property('meal_type');
        response.body.meal_type.should.equal('Breakfast');
        response.body.should.have.property('foods');
        response.body.foods.should.be.a('array');
        response.body.foods.length.should.equal(2);
        response.body.foods[0].should.have.property('id');
        response.body.foods[0].id.should.equal(1);
        response.body.foods[0].should.have.property('title');
        response.body.foods[0].title.should.equal('Banana');
        response.body.foods[0].should.have.property('calories');
        response.body.foods[0].calories.should.equal(105);
        done();
      });
    });
  
    it('should return 404 if meal with given id is not found', done => {
      chai.request(server)
      .get('/api/v1/meals/100/foods')
      .end((error, response) => {
        response.should.have.status(404);
        response.should.be.json;
        response.body.should.have.property('error');
        response.body.error.should.equal('Could not find meal with id 100');
        done();
      });
    });
  });
  
  
  describe('POST /api/v1/meals/:meal_id/foods/:id', () => {
    it('should ADD A FOOD to A MEAL given their ids', done => {
      chai.request(server)
      .post('/api/v1/meals/1/foods/1')
      .end((error, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.have.property('message');
        response.body.message.should.equal('Successfully added Banana to Breakfast');
        done();
      });
    });

    it('should return 404 if MEAL with given id is not found', done => {
      chai.request(server)
      .get('/api/v1/meals/100/foods/1')
      .end((error, response) => {
       response.should.have.status(404);
       done();
      });
    });
    
    it('should return 404 if FOOD with given id is not found', done => {
      chai.request(server)
      .get('/api/v1/meals/1/foods/100')
      .end((error, response) => {
       response.should.have.status(404);
       done();
      });
    });
  });
  
  
  describe('DELETE /api/v1/meals/:meal_id/foods/:id', () => {
    it('should DELETE a FOOD form a MEAL given their IDs', (done) => {
      chai.request(server)
      .delete('/api/v1/meals/1/foods/1')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('message');
        response.body.message.should.equal('Successfully removed Banana from Breakfast');
        chai.request(server)
        .delete('/api/v1/meals/1/foods/1')
        .end((error, response) => {
          response.should.have.status(404);
          response.should.be.json;
          response.body.should.have.property('error');
          response.body.error.should.equal('Could not find record with meal id 1 and food id 1');
          done();
        });
      });
    });
    
    it('should return 404 if MEAL with given id is not found', done => {
      chai.request(server)
      .delete('/api/v1/meals/100/foods/1')
      .end((error, response) => {
       response.should.have.status(404);
       response.should.be.json;
       response.body.should.have.property('error');
       response.body.error.should.equal('Could not find record with meal id 100 and food id 1');
       done();
      });
    });
    
    it('should return 404 if FOOD with given id is not found', done => {
      chai.request(server)
      .delete('/api/v1/meals/1/foods/100')
      .end((error, response) => {
       response.should.have.status(404);
       response.should.be.json;
       response.body.should.have.property('error');
       response.body.error.should.equal('Could not find record with meal id 1 and food id 100');
       done();
      });
    });
  });
});
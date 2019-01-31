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
    it('should create a new food', done => {
      chai.request(server)
      .post('/api/v1/foods')
      .send({
        title: 'Orange',
        calories: 45
      })
      .end((error, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        done();
      });
    });
  });
  
  it('should not create a record with missing attribute', done => {
    chai.request(server)
    .post('/api/v1/foods')
    .send({
      title: 'Orange',
    })
    .end((error, response) => {
      response.should.have.status(400);
      response.body.error.should.equal(
        `Expected format: { title: <String>, calories: <Integer> }. You're missing a "calories" property.`
      );
      done();
    });
  });
  
  describe('PATCH /api/v1/foods/:id', () => {
    it('it should UPDATE a food given the id', (done) => {
      chai.request(server)
      .patch('/api/v1/foods/1')
      .send({ title: 'Orange', calories: 45 })
      .end((error, response) => {
        response.should.have.status(200);
        response.body.should.have.property('message');
        response.body.message.should.equal('Food updated!');
        chai.request(server)
        .get('/api/v1/foods/1')
        .end((error, response) => {
          response.body[0].title.should.equal('Orange');
          response.body[0].calories.should.equal(45);
          done();
        });
      });
    });
  });
  
  describe('GET /api/v1/foods', () => {
   it('should return all of the foods', done => {
      chai.request(server)
      .get('/api/v1/foods')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('title');
        response.body[0].title.should.equal('Banana');
        response.body[0].should.have.property('calories');
        response.body[0].calories.should.equal(105);
        done();
      });
    });
  });
  
  describe('GET /api/v1/foods/:id', () => {
   it('should return a food given the id', done => {
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
       .get('/api/v1/foods/3')
       .end((error, response) => {
         response.should.have.status(404);
         response.should.be.json;
         response.body.should.have.property('error');
         response.body.error.should.equal('Could not find food with id 3');
         done();
       });
     });
  });
  
  describe('DELETE /api/v1/foods/:id', () => {
    it('it should DELETE a food given the id', (done) => {
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
  });
  
  describe('GET /api/v1/meals', () => {
   it('should return all of the meals', done => {
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
        response.body[0].goal_calories.should.equal(650);
        done();
      });
    });
  });
});
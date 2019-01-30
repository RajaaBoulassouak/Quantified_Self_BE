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
});
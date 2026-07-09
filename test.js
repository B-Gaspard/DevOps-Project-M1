const request = require('supertest');
const app = require('./server'); 

describe('GET /', () => {
    it('should return 200 OK and valid html content', (done) => {
        request(app)
            .get('/')
            .expect(200)
            .expect('Content-Type', /html/)
            .end(done);
    });
});
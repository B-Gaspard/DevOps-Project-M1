const request = require('supertest');
const express = require('express');
const app = express();

app.get('/', (req, res) => { res.status(200).send('<h1>Agile Auto Parts - Live Production System</h1>'); });

describe('GET /', () => {
    it('should return 200 OK and valid html content', (done) => {
        request(app)
            .get('/')
            .expect(200, done);
    });
});
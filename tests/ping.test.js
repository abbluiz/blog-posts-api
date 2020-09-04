const request = require('supertest');

const app = require('../src/app');

test('Should ping server', async () => {

    await request(app).get('/api/ping').send()
        .expect(200);

});
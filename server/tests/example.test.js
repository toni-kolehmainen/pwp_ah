const { test, after } = require('node:test')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('test connection', async () => {
  await api
    .get('/test')
    .expect(200)
})
// The above test is a simple test to check if the server is running.
/*
Test idead:
- Content-Type is application/json (extra credit)
- 
 */

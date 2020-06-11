const request = require('supertest');
const app = require('../server');
const https = require('https');

const agent = new https.Agent({
	rejectUnauthorized: false,
});

var options = {
	host: 'localhost',
	port: 3000
};

options.agent = agent;

describe('Post Endpoints', () => {
	it('should login', async () => {
		const res = await request(app)
			.post('/control-center/api/login')
			.trustLocalhost()
			.send({
				username: 'sofia',
				password: 'okokokok'
			})
		expect(res.statusCode).toEqual(200)
		// expect(res.body).toHaveProperty('user')
	});
});

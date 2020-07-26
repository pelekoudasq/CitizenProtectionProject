const request = require('supertest');
const server = require('../server');
const fs = require('fs');
const robot_data = require('./RobotTestData.json');

describe('Robot Test Endpoints', () => {

	it('RT01. Health check status is OK', async done => {

		const res = await request(server)
			.get('/control-center/api/health-check')
			.trustLocalhost()
		expect(res.statusCode).toEqual(200)
		expect(JSON.parse(res.text).status).toEqual('OK')
		done()
	})


	it('RT02. The database is reset successfully', async done => {

		const res = await request(server)
			.get('/control-center/api/reset')
			.trustLocalhost()
		expect(res.statusCode).toEqual(200)
		expect(JSON.parse(res.text).status).toEqual('OK')
		done()
	})


	it('RT03. Admin logs in successfully', async done => {

		const res = await request(server)
			.post('/control-center/api/login')
			.trustLocalhost()
			.send({
				username: 'sofia',
				password: 'okokokok'
			})
		expect(res.statusCode).toEqual(200)
		fs.writeFile('/tmp/admin-user-robot.json', JSON.stringify(JSON.parse(res.text)), function(err){
			done()
		})
	})


	it('RT04. Admin creates multiple users', async done => {

		fs.readFile('/tmp/admin-user-robot.json', async function(err, data) {
			const token = JSON.parse(data).token;
			// fs.readFile('./RobotTestData', async function(err, data2) {
				const users = robot_data.users;
				console.log(users)
				done()
			// })
		})
	})


	it('RT05. Admin updates one user and deletes the rest of the users', async done => {

		fs.readFile('/tmp/admin-user-robot.json', async function(err, data) {
			const token = JSON.parse(data).token;
			done()
		})
	})


	it('RT06. User logs in', async done => {

		done()
	})


	it('RT07. User manages a list of incidents', async done => {

		done()
	})


	it('RT08. User logs out', async done => {

		done()
	})


	it('RT09. Admin deletes the remaining user', async done => {

		done()
	})


	it('RT10. Admin logs out', async done => {

		fs.readFile('/tmp/admin-user-robot.json', async function(err, data) {
			const token = JSON.parse(data).token;
			const res = await request(server)
				.get(`/control-center/api/logout`)
				.set('Authorization', `Bearer ${token}`)
				.trustLocalhost()
			expect(res.statusCode).toEqual(200)
			fs.unlink('/tmp/admin-user-robot.json', function(err){
				done()
			})
		})
	})


	afterAll(async done => {
		server.close(done);
		done();
	})

});



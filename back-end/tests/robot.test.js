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
			const users = robot_data.users;
			for await (const user of users) {
			// await users.forEach(async user => {
				const res = await request(server)
					.post('/control-center/api/admin/users')
					.set('Authorization', `Bearer ${token}`)
					.trustLocalhost()
					.send({
						username: user.username,
						password: user.password,
						firstName: user.firstName,
						lastName: user.lastName,
						role: 2,
						agency: 1,
					})
				expect(res.statusCode).toEqual(200)
				expect(JSON.parse(res.text).username).toEqual(user.username)
				expect(JSON.parse(res.text).name.firstName).toEqual(user.firstName)
				expect(JSON.parse(res.text).name.lastName).toEqual(user.lastName)
				expect(JSON.parse(res.text).userType).toEqual(2)
				expect(JSON.parse(res.text).details.authorityType).toEqual(1)
				fs.writeFile(`/tmp/${user.username}-robot.json`, JSON.stringify(JSON.parse(res.text)), function(err){
					// done()
				})
			}
			done()
		})
	})


	it('RT05. Admin updates one user and deletes the rest of the users', async done => {

		fs.readFile('/tmp/admin-user-robot.json', async function(err, data) {
			const token = JSON.parse(data).token;
			const users = robot_data.users;
			// var first_updated = false
			for await (const user of users) {
				fs.readFile(`/tmp/${user.username}-robot.json`, async function(err, data2) {
					const user_id = JSON.parse(data2)._id;
					if (user.username === 'username_1') { // update first
						// first_updated = true
						const res = await request(server)
							.put(`/control-center/api/admin/users/${user_id}`)
							.set('Authorization', `Bearer ${token}`)
							.trustLocalhost()
							.send({
								username: 'robot-update',
								firstName: 'a_nameUpd',
								lastName: 'a_surnameUpd',
								role: 2,
								agency: 1,
							})
						expect(res.statusCode).toEqual(200)
						expect(JSON.parse(res.text).username).toEqual('robot-update')
						expect(JSON.parse(res.text).name.firstName).toEqual('a_nameUpd')
						expect(JSON.parse(res.text).name.lastName).toEqual('a_surnameUpd')
						expect(JSON.parse(res.text).userType).toEqual(2)
						expect(JSON.parse(res.text).details.authorityType).toEqual(1)
					} else { //delete rest
						const res = await request(server)
							.delete(`/control-center/api/admin/users/${user_id}`)
							.set('Authorization', `Bearer ${token}`)
							.trustLocalhost()
						expect(res.statusCode).toEqual(200)
						fs.unlink(`/tmp/${user.username}-robot.json`, function(err) {})
					}
				})
			}
			done()
		})
	})


	it('RT06. User logs in', async done => {
		
		fs.readFile('/tmp/username_1-robot.json', async function(err, data) {
			const res = await request(server)
				.post('/control-center/api/login')
				.trustLocalhost()
				.send({
					username: 'username_1',
					password: 'a_password'
				})
			expect(res.statusCode).toEqual(200)
			fs.writeFile('/tmp/new-user-robot.json', JSON.stringify(JSON.parse(res.text)), function(err){
				done()
			})
		})
	})


	it('RT07. User manages a list of incidents', async done => {

		fs.readFile('/tmp/new-user-robot.json', async function(err, data) {
			const token = JSON.parse(data).token;
			const incidents = robot_data.incidents;
			for await (const incident of incidents) {
				const res = await request(server)
					.post('/control-center/api/incidents')
					.set('Authorization', `Bearer ${token}`)
					.trustLocalhost()
					.send({
						title: incident.title,
						address: 'Address 19, 19489',
						priority: 'Μέτρια',
						x: incident.x,
						y: incident.y,
						auth: ["1"],
						startDate: incident.startDate,
						endDate: incident.endDate,
						description: incident.description
					})
				expect(res.statusCode).toEqual(200)
				fs.writeFile(`/tmp/${incident.title}-robot.json`, JSON.stringify(JSON.parse(res.text)), function(err){
					// done()
				})
			}
			done()
		})
	})


	it('RT08. User logs out', async done => {

		fs.readFile('/tmp/new-user-robot.json', async function(err, data) {
			const token = JSON.parse(data).token;
			const res = await request(server)
				.get(`/control-center/api/logout`)
				.set('Authorization', `Bearer ${token}`)
				.trustLocalhost()
			expect(res.statusCode).toEqual(200)
			fs.unlink('/tmp/new-user-robot.json', function(err){
				done()
			})
		})
	})


	it('RT09. Admin deletes the remaining user', async done => {

		fs.readFile('/tmp/admin-user-robot.json', async function(err, data) {
			const token = JSON.parse(data).token;
			fs.readFile('/tmp/username_1-robot.json', async function(err, data2) {
				const user_id = JSON.parse(data2)._id;
				const res = await request(server)
					.delete(`/control-center/api/admin/users/${user_id}`)
					.set('Authorization', `Bearer ${token}`)
					.trustLocalhost()
				expect(res.statusCode).toEqual(200)
				fs.unlink('/tmp/username_1-robot.json', function(err){
					done()
				})
			})
		})
	})


	it('RT10. Admin logs out', async done => {

		fs.readFile('/tmp/admin-user-robot.json', async function(err, data) {
			const token = JSON.parse(data).token;
			const res = await request(server)
				.get(`/control-center/api/logout`)
				.set('Authorization', `Bearer ${token}`)
				.trustLocalhost()
			expect(res.statusCode).toEqual(200)
			fs.unlink('/tmp/admin-user-robot.json', function(err) {
				done()
			})
		})
	})


	afterAll(async done => {
		server.close(done);
		done();
	})

});



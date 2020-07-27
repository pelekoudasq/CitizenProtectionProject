const request = require('supertest');
const server = require('../server');
const fs = require('fs');


describe('Functional Test Endpoints', () => {

	it('T01. Health check status is OK', async done => {

		const res = await request(server)
			.get('/control-center/api/health-check')
			.trustLocalhost()
		expect(res.statusCode).toEqual(200)
		expect(JSON.parse(res.text).status).toEqual('OK')
		done()
	})


	it('T02. The database is reset successfully', async done => {

		const res = await request(server)
			.get('/control-center/api/reset')
			.trustLocalhost()
		expect(res.statusCode).toEqual(200)
		expect(JSON.parse(res.text).status).toEqual('OK')
		done()
	})


	it('T03. Admin logs in successfully', async done => {

		const res = await request(server)
			.post('/control-center/api/login')
			.trustLocalhost()
			.send({
				username: 'admin',
				password: 'pass123!'
			})
		expect(res.statusCode).toEqual(200)
		fs.writeFile('/tmp/admin-user.json', JSON.stringify(JSON.parse(res.text)), function(err){
			done()
		})
	})


	it('T04. Admin creates a temp user', async done => {

		fs.readFile('/tmp/admin-user.json', async function(err, data) {
			const token = JSON.parse(data).token;
			const res = await request(server)
				.post('/control-center/api/admin/users')
				.set('Authorization', `Bearer ${token}`)
				.trustLocalhost()
				.send({
					username: 'temporary_user',
					password: 'a_password',
					firstName: 'a_name',
					lastName: 'a_surname',
					role: 2,
					agency: 1,
				})
			expect(res.statusCode).toEqual(200)
			expect(JSON.parse(res.text).username).toEqual('temporary_user')
			expect(JSON.parse(res.text).name.firstName).toEqual('a_name')
			expect(JSON.parse(res.text).name.lastName).toEqual('a_surname')
			expect(JSON.parse(res.text).userType).toEqual(2)
			expect(JSON.parse(res.text).details.authorityType).toEqual(1)
			fs.writeFile('/tmp/new-user.json', JSON.stringify(JSON.parse(res.text)), function(err){
				done()
			})
		})
	})


	it('T05. Admin updates the temp user', async done => {

		fs.readFile('/tmp/admin-user.json', async function(err, data) {
			const token = JSON.parse(data).token;
			fs.readFile('/tmp/new-user.json', async function(err, data2) {
				const temp_user_id = JSON.parse(data2)._id;
				const res = await request(server)
					.put(`/control-center/api/admin/users/${temp_user_id}`)
					.set('Authorization', `Bearer ${token}`)
					.trustLocalhost()
					.send({
						username: 'temporary_userUpd',
						firstName: 'a_nameUpd',
						lastName: 'a_surnameUpd',
						role: 4,
						agency: 2,
					})
				expect(res.statusCode).toEqual(200)
				expect(JSON.parse(res.text).username).toEqual('temporary_userUpd')
				expect(JSON.parse(res.text).name.firstName).toEqual('a_nameUpd')
				expect(JSON.parse(res.text).name.lastName).toEqual('a_surnameUpd')
				expect(JSON.parse(res.text).userType).toEqual(4)
				expect(JSON.parse(res.text).details.authorityType).toEqual(2)
				done()
			})
		})
	})


	it('T06. Temp user logs in', async done => {

		const res = await request(server)
			.post('/control-center/api/login')
			.trustLocalhost()
			.send({
				username: 'temporary_userUpd',
				password: 'a_password'
			})
		expect(res.statusCode).toEqual(200)
		fs.writeFile('/tmp/new-user.json', JSON.stringify(JSON.parse(res.text)), function(err){
			done()
		})
	})


	it('T07. Temp user creates a new incident', async done => {

		fs.readFile('/tmp/new-user.json', async function(err, data) {
			const token = JSON.parse(data).token;
			const res = await request(server)
				.post('/control-center/api/incidents')
				.set('Authorization', `Bearer ${token}`)
				.trustLocalhost()
				.send({
					title: 'temporary_incidentTitle',
					address: 'Panepistimioupoli, Zografou 157 72',
					priority: 'Μέτρια',
					auth: ["1", "3"]
				})
			expect(res.statusCode).toEqual(200)
			fs.writeFile('/tmp/new-incident.json', JSON.stringify(JSON.parse(res.text)), function(err){
				done()
			})
		})
	})


	it('T08. Temp user retrieves a list of incidents', async done => {

		fs.readFile('/tmp/new-user.json', async function(err, data) {
			const token = JSON.parse(data).token;
			const res = await request(server)
				.get('/control-center/api/incidents/?start=0&count=1')
				.set('Authorization', `Bearer ${token}`)
				.trustLocalhost()
			expect(res.statusCode).toEqual(200)
			expect(JSON.parse(res.text).length).toEqual(1)
			done()
		})
	})


	it('T09. Temp user updates an incident', async done => {

		fs.readFile('/tmp/new-user.json', async function(err, data) {
			const token = JSON.parse(data).token;
			fs.readFile('/tmp/new-incident.json', async function(err, data2) {
				const incident_id = JSON.parse(data2)._id;
				const res = await request(server)
					.post(`/control-center/api/incidents/update/${incident_id}`)
					.set('Authorization', `Bearer ${token}`)
					.trustLocalhost()
					.send({
						description: 'This is a test description from temp user',
						callerName: 'temporary_callerName',
						callerNumber: 'temporary_callerNumber',
						keywords: ["tempKeyword1", "tempKeyword2"]
					})
				expect(res.statusCode).toEqual(200)
				done()
			})
		})
	})


	it('T10. Temp user retrieves an incident', async done => {

		fs.readFile('/tmp/new-user.json', async function(err, data) {
			const token = JSON.parse(data).token;
			fs.readFile('/tmp/new-incident.json', async function(err, data2) {
				const incident_id = JSON.parse(data2)._id;
				const res = await request(server)
					.get(`/control-center/api/incidents/${incident_id}`)
					.set('Authorization', `Bearer ${token}`)
					.trustLocalhost()
				expect(res.statusCode).toEqual(200)
				expect(JSON.parse(res.text)._id).toEqual(incident_id)
				done()
			})
		})
	})


	it('T11. Temp user deletes an incident', async done => {

		fs.readFile('/tmp/new-user.json', async function(err, data) {
			const token = JSON.parse(data).token;
			fs.readFile('/tmp/new-incident.json', async function(err, data2) {
				const incident_id = JSON.parse(data2)._id;
				const res = await request(server)
					.delete(`/control-center/api/incidents/${incident_id}`)
					.set('Authorization', `Bearer ${token}`)
					.trustLocalhost()
				expect(res.statusCode).toEqual(200)
				fs.unlink('/tmp/new-incident.json', function(err){
					done()
				})
			})
		})
	})


	it('T12. Temp user logs out', async done => {

		fs.readFile('/tmp/new-user.json', async function(err, data) {
			const token = JSON.parse(data).token;
			const res = await request(server)
				.get(`/control-center/api/logout`)
				.set('Authorization', `Bearer ${token}`)
				.trustLocalhost()
			expect(res.statusCode).toEqual(200)
			done()
		})
	})


	it('T13. Admin deletes the temp user', async done => {

		fs.readFile('/tmp/admin-user.json', async function(err, data) {
			const token = JSON.parse(data).token;
			fs.readFile('/tmp/new-user.json', async function(err, data2) {
				const user_id = JSON.parse(data2)._id;
				const res = await request(server)
					.delete(`/control-center/api/admin/users/${user_id}`)
					.set('Authorization', `Bearer ${token}`)
					.trustLocalhost()
				expect(res.statusCode).toEqual(200)
				fs.unlink('/tmp/new-user.json', function(err){
					done()
				})
			})
		})
	})


	it('T14. Admin logs out', async done => {

		fs.readFile('/tmp/admin-user.json', async function(err, data) {
			const token = JSON.parse(data).token;
			const res = await request(server)
				.get(`/control-center/api/logout`)
				.set('Authorization', `Bearer ${token}`)
				.trustLocalhost()
			expect(res.statusCode).toEqual(200)
			fs.unlink('/tmp/admin-user.json', function(err){
				done()
			})
		})
	})

	afterAll(async done => {
		server.close(done);
		done();
	})

});



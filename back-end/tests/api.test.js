const request = require('supertest');
const server = require('../server');
const fs = require('fs');


describe('Test Endpoints', () => {

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
				username: 'sofia',
				password: 'okokokok'
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
			fs.readFile('/tmp/new-user.json', async function(err, data) {
				const temp_user_id = JSON.parse(data)._id;
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

	afterAll(async done => {
		server.close(done);
		done();
	})

});



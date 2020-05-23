const program = require('commander');
const axios = require('axios');
const https = require('https');
const fs = require('fs');

const apiUrl = 'https://localhost:9000/control-center/api';
const agent = new https.Agent({
	rejectUnauthorized: false
});

export function cli(args) {

	program
		.command('health-check')
		.option('--format')
		.action(function () {
			axios.get(`${apiUrl}/health-check`, { httpsAgent: agent })
				.then(function (response) {
					// handle success
					console.log(response.data);
				})
				.catch(function (error) {
					// handle error
					console.log('{ status: \'error\' }');
				})
		});

	program
		.command('logout')
		.action(function () {
			fs.unlink('/tmp/user.json', function(err) {
				if(err) {
					return console.log('Removing token failed:', err);
				}
				console.log('Logout successful. Token removed');
			}); 
		});

	program
		.command('login')
		.option('--format')
		.requiredOption('--username <value>', 'User\'s username')
		.requiredOption('--password <value>', 'User\'s password')
		.action(function (command) {
			axios.post(`${apiUrl}/login`, {
					username: command.username,
					password: command.password
				}, { httpsAgent: agent })
				.then(function (response) {
					// console.log(response.data);
					fs.writeFile('/tmp/user.json', JSON.stringify(response.data), function(err) {
						if(err) {
							return console.log('Writing token failed:', err);
						}
						console.log('Login successful. Token saved');
					}); 
				})
				.catch(function (error) {
					console.log('Login failed: ', error.response.data.error);
				});
		});

	program
		.command('list-users')
		.option('--format')
		.option('--start')
		.option('--count')
		.action(function () {
			fs.readFile('/tmp/user.json', function(err, data) {
				if (err) {
					return console.log('Token not found. Login first', err);
				}
				const token = JSON.parse(data).token;
				axios.get(`${apiUrl}/admin/users/all`, { httpsAgent: agent, headers: { 'Authorization': `Bearer ${token}` } })
					.then(function (response) {
						// handle success
						console.log(response.data);
					})
					.catch(function (error) {
						// handle error
						console.log('{ status: \'error\' }');
					})
			})
		});

	program.parse(process.argv);
}

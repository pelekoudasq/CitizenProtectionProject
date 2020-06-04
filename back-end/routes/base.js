// import packages
const express = require('express');
const mongojs = require('mongojs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const json2xml = require('json2xml');

// import files
const config = require('../config.json');

// declare vars
const router = express.Router();
const db = mongojs(config.dburi);

// get system health
router.get('/health-check', function(req, res, next) {
	console.log('system health-check');
	const format = req.query.format
	db.runCommand({ping: 1}, function (err, health) {
		if (err || !health.ok)
			res.status(500).json(err);
		if (format && format === "xml")
			res.send(json2xml({ status : 'OK' }))
		else
			res.json({ status : 'OK' })
	}) 
})

// reset system
router.get('/reset', function(req, res, next) {
	console.log('system reseting..');
	const format = req.query.format
	// db.runCommand({ping: 1}, function (err, health) {
		// if (err || !health.ok){
			// res.status(500).json(err);
		// }
		if (format && format === "xml")
			res.send(json2xml({ status : 'OK' }))
		else
			res.json({ status : 'OK' })
	// }) 
})

// logout
router.get('/logout', function(req, res, next) {
	console.log('logout');
	const format = req.query.format
	// db.runCommand({ping: 1}, function (err, health) {
		// if (err || !health.ok){
			// res.status(500).json(err);
		// }
		if (format && format === "xml")
			res.send(json2xml({ logout : 'completed' }))
		else
			res.json({ logout : 'completed' })
	// }) 
})

async function comparePass(user, password) {
	if (user) {
		if (bcrypt.compareSync(password, user.passwordHash)) {
			const token = jwt.sign({ sub: user.id }, config.secret); // <==== The all-important "jwt.sign" function
			// const userObj = new User(user);
			const { password, ...userWithoutHash } = user;
			return {
				...userWithoutHash,
				token
			};
		} else {
			//console.log('Wrong pswd');
		}
	}
}

// login user
router.post('/login', function(req, res, next) {
	console.log('login');
	const format = req.query.format
	db.Users.findOne({ username: req.body.username }, function(err, user) {
		comparePass(user, req.body.password)
			.then(userRes => {
				if (userRes) {
					if (format && format === "xml")
						res.send(json2xml(userRes))
					else
						res.json(userRes)
				}
				else {
					if (format && format === "xml")
						res.status(400).send(json2xml({ error: 'Username or password is incorrect' }))
					else
						res.status(400).json({ error: 'Username or password is incorrect' })
				}
			})
			.catch(err => next(err));
	});
});

module.exports = router;

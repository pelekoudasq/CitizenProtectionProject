// import packages
const bcrypt = require('bcryptjs');
const express = require('express');
const json2xml = require('json2xml');
const jwt = require('jsonwebtoken');
const mongojs = require('mongojs');

// import files
const config = require('../config.json');

// declare vars
const db = mongojs(config.dburi);
const router = express.Router();

// get system health
router.get('/health-check', function(req, res, next) {

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

	const format = req.query.format;
	if (format && format === "xml")
		res.send(json2xml({ status : 'OK' }))
	else
		res.json({ status : 'OK' })
})

// logout
router.get('/logout', function(req, res, next) {

	const format = req.query.format;
	if (format && format === "xml")
		res.send(json2xml({ logout : 'completed' }))
	else
		res.json({ logout : 'completed' })
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

	const format = req.query.format
	db.Users.findOne({ username: req.body.username }, function(err, user) {
		comparePass(user, req.body.password)
			.then(userRes => {
				if (userRes) {
					db.Users.update(
						{ _id: userRes._id },
						{
							$set: {
								lastLoggedIn: new Date()
							}
						}
					, function(err, user) {
						if (format && format === "xml")
							res.send(json2xml(userRes))
						else
							res.json(userRes)
					});
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

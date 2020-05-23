// import packages
const express = require('express');
const mongojs = require('mongojs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// import files
const config = require('../config.json');

// declare vars
const router = express.Router();
const db = mongojs(config.dburi);

// get system health
router.get('/health-check', function(req, res, next) {
	console.log('system health-check');
	db.runCommand({ping: 1}, function (err, health) {
		if (err || !health.ok){
			res.status(500).json(err);
		}
		res.json({ status : 'ok' })
	}) 
})

// reset system
router.get('/reset', function(req, res, next) {
	console.log('system reseting..');
	// db.runCommand({ping: 1}, function (err, health) {
		// if (err || !health.ok){
			// res.status(500).json(err);
		// }
		res.json({reset : 'completed'})
	// }) 
})

// logout
router.get('/logout', function(req, res, next) {
	console.log('logout');
	// db.runCommand({ping: 1}, function (err, health) {
		// if (err || !health.ok){
			// res.status(500).json(err);
		// }
		res.json({logout : 'completed'})
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
	db.Users.findOne({ username: req.body.username }, function(err, user) {
		comparePass(user, req.body.password)
			.then(userRes => userRes ? res.json(userRes) : res.status(400).json({ error: 'Username or password is incorrect' }))
			.catch(err => next(err));
	});
});

module.exports = router;

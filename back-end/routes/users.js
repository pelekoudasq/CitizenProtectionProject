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

// aux functions

async function getById(id) {
	await db.Users.findOne({_id: id}, function(err, user) {
		if(user)
			return user;
		return null;
	});
}

async function comparePass(user, password) {
	if(user) {
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

//routes
//Authenticate user
router.post('/authenticate', function(req, res, next) {
	console.log('users: authenticate');
	db.Users.findOne({ username: req.body.username }, function(err, user) {
		comparePass(user, req.body.password)
			.then(userRes => userRes ? res.json(userRes) : res.status(400).json({ error: 'Username or password is incorrect' }))
			.catch(err => next(err));
	});
});

//get all users
router.get('/all', function(req, res, next) {
	console.log('users: get all');
	db.Users.find(function(err, users) {
		if (err) {
			res.send(err);
			return;
		}
		res.json(users);
	})
})

//get user by id
router.get('/:id', function(req, res, next) {
	console.log('users: get by id');
	db.Users.find({ _id: mongojs.ObjectID(req.params.id) }, function(err, user) {
		if (err) {
			res.send(err);
			return;
		}
		res.json(user);
	})
})


module.exports = router;
// module.exports = {
	// router : router,
	// getById: getById
// }

// import packages
const express = require('express');
const mongojs = require('mongojs');


// import files
const config = require('../config.json');

// declare vars
const router = express.Router();
const db = mongojs(config.dburi);

//routes

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

// import packages
const express = require('express');
const mongojs = require('mongojs');
const json2xml = require('json2xml');

// import files
const config = require('../config.json');

// declare vars
const router = express.Router();
const db = mongojs(config.dburi);

// aux functions

async function getById(id) {
	await db.Users.findOne({ _id: id }, function(err, user) {
		if (user)
			return user;
		return null;
	});
}

// routes

// get all users
router.get('/', function(req, res, next) {
	console.log('users: get all');
	const format = req.query.format
	db.Users.find(function(err, users) {
		if (err) {
			if (format && format === "xml")
				res.send(json2xml(err))
			else
				res.json(err)
			res.send(err);
			return;
		}
		if (format && format === "xml"){
			res.send(json2xml(users))
		}
		else
			res.json(users)
	})
})

//get user by id
router.get('/:id', function(req, res, next) {
	console.log('users: get by id');
	const format = req.query.format
	db.Users.find({ _id: mongojs.ObjectID(req.params.id) }, function(err, user) {
		if (err) {
			if (format && format === "xml")
				res.send(json2xml(err))
			else
				res.json(err)
			res.send(err);
			return;
		}
		if (format && format === "xml"){
			res.send(json2xml(user))
		}
		else
			res.json(user)
	})
})

// get incident requests
router.get('/requests/:user_id', function(req, res, next) {
	console.log('users: get incident requests by user');
	db.Users.findOne({ _id: mongojs.ObjectID(req.params.user_id) }, function(err, user) {
		if (err) {
			res.send(err);
			return;
		}
		if (user.userType == 2) {
			res.json({ incidentRequests: user.incidentRequests});
		}
		else
			res.status(404).json({ error: 'User is not an officer in duty' });
	})
})

// get accepted incidents
router.get('/accepted/:user_id', function(req, res, next) {
	console.log('users: get incident requests by user');
	db.Users.findOne({ _id: mongojs.ObjectID(req.params.user_id) }, function(err, user) {
		if (err) {
			res.send(err);
			return;
		}
		if (user.userType == 2) {
			res.json({ acceptedIncidents: user.acceptedIncidents});
		}
		else
			res.status(404).json({ error: 'User is not an officer in duty' });
	})
})

// module.exports = router;
module.exports = {
	router : router,
	getById: getById
}

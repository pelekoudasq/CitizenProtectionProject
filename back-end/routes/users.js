// import packages
const bcrypt = require('bcryptjs');
const express = require('express');
const json2xml = require('json2xml');
const mongojs = require('mongojs');

// import files
const config = require('../config.json');

// declare vars
const db = mongojs(config.dburi);
const router = express.Router();


// aux functions
async function getById(id) {

	await db.Users.findOne({ _id: id }, function(err, user) {
		if (user)
			return user;
		return null;
	});
}

// ROUTES

// GET all Users
router.get('/', function(req, res, next) {

	const format = req.query.format;
	const start = parseInt(req.query.start);
	const count = parseInt(req.query.count);
	db.Users.find({}).limit(count).skip(start, function(err, users) {
		if (err) {
			if (format && format === "xml")
				res.send(json2xml(err));
			else
				res.json(err);
			return;
		}
		if (format && format === "xml")
			res.send(json2xml(users));
		else
			res.json(users);
	});
});


// TODO: if userType in [1, 2, 5] must have agency
// Add new user
router.post('/', function(req, res, next){

	const format = req.query.format;
	const username = req.body.username;
	const password = req.body.password;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const role = req.body.role;
	const agency = req.body.agency;
	db.Users.findOne({ username: username }, function(err, user){
		if (user) {
			res.status(400).json({ error: 'This username is already in use' });
			return;
		} else {
			passwordHash = bcrypt.hashSync(password, 10);
			db.Users.save({
				userType: role,
				name: {
					firstName: firstName,
					lastName: lastName
				},
				details: {
					authorityType: agency
				},
				username: username,
				passwordHash: passwordHash,
				lastLoggedIn: new Date()
			});
			db.Users.findOne({ username: username }, function(err, newUser){
				if (format && format === "xml")
					res.send(json2xml(newUser));
				else
					res.json(newUser);
				return;
			});
		}
	});
});


// UPDATE user
router.put('/:id', function(req, res, next) {

	const format = req.query.format;
	var username = req.body.username;
	var password = req.body.password;
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var role = req.body.role;
	var agency = req.body.agency;
	db.Users.findOne({ _id: mongojs.ObjectID(req.params.id)  }, function(err, user){
		if (err) {
			if (format && format === "xml")
				res.send(json2xml(err));
			else
				res.json(err);
			return;
		}
		if (!username) { username = user.username; }
		if (!firstName) { firstName = user.name.firstName; }
		if (!lastName) { lastName = user.name.lastName; }
		if (!role) { role = user.userType; }
		if (!agency && user.details) { agency = user.details.authorityType; }

		// keep prev details
		var departmentId, area, lat, long;
		if (user.details) {
			departmentId = user.details.departmentId;
			area = user.details.area;
			lat = user.details.lat;
			long = user.details.long;
		}

		if (password)
			passwordHash = bcrypt.hashSync(password, 10);
		else
			passwordHash = user.passwordHash;

		db.Users.update(
			{ _id: user._id },
			{
				$set: {
					username : username,
					name: {
						firstName : firstName,
						lastName : lastName
					},
					passwordHash : passwordHash,
					userType : role,
					details : {
						authorityType: agency,
						departmentId: departmentId,
						area: area,
						lat: lat,
						long: long
					}
				}
			},
			function(err, result) {
				if (err) {
					if (format && format === "xml")
						res.send(json2xml(err));
					else
						res.json(err);
					return;
				}
				db.Users.findOne({ _id: mongojs.ObjectID(req.params.id) }, function(err, updUser){
					if (err) {
						if (format && format === "xml")
							res.send(json2xml(err));
						else
							res.json(err);
						return;
					}
					if (format && format === "xml")
						res.send(json2xml(updUser));
					else
						res.json(updUser);
				});
		});
	});
});


// DELETE user
router.delete('/:id', function(req, res, next) {

	// console.log('DEEEEEEEELEEEEEEEEEEETEEEEEEEEEEEEEE');
	const format = req.query.format;
	db.Users.remove({ _id: mongojs.ObjectID(req.params.id) }, function(err, result) {
		if (err) {
			if (format && format === "xml")
				res.send(json2xml(err));
			else
				res.json(err);
			return;
		}
		if (format && format === "xml")
			res.send(json2xml(result));
		else
			res.json(result);
	});
});


// GET user by id
router.get('/:id', function(req, res, next) {

	const format = req.query.format;
	db.Users.findOne({ _id: mongojs.ObjectID(req.params.id) }, function(err, user) {
		if (err) {
			if (format && format === "xml")
				res.send(json2xml(err));
			else
				res.json(err);
			return;
		}
		if (format && format === "xml")
			res.send(json2xml(user));
		else
			res.json(user);
	});
});


// GET incident requests
router.get('/requests/:user_id', function(req, res, next) {

	// console.log('users: get incident requests by user');
	db.Users.findOne({ _id: mongojs.ObjectID(req.params.user_id) }, function(err, user) {
		if (err) {
			res.send(err);
			return;
		}
		if (user.userType == 2) {
			db.Incidents.find({ _id: { $in: user.incidentRequests }, active: true }, function(err, incidents) {
				if (err) {
					res.send(err);
					return;
				}
				res.json({ incidents });
			});
		}
		else
			res.status(404).json({ error: 'User is not an officer in duty' });
	});
});


// GET accepted incidents
router.get('/accepted/:user_id', function(req, res, next) {

	console.log('users: get accepted incidents by user');
	db.Users.findOne({ _id: mongojs.ObjectID(req.params.user_id) }, function(err, user) {
		if (err) {
			res.send(err);
			return;
		}
		if (user.userType == 2) {
			db.Incidents.find({ _id: { $in: user.acceptedIncidents } }, function(err, incidents) {
				if (err) {
					res.send(err);
					return;
				}
				res.json({ incidents });
			});
		}
		else
			res.status(404).json({ error: 'User is not an officer in duty' });
	});
});


// module.exports = router;
module.exports = {
	router : router,
	getById: getById
}

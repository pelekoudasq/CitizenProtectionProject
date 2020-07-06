// import packages
const express = require('express');
const mongojs = require('mongojs');
const opencage = require('opencage-api-client');
const json2xml = require('json2xml');


// import files
const config = require('../config.json');

// declare vars
const router = express.Router();
const db = mongojs(config.dburi);

//routes

//GET all incidents
router.get('/', function(req, res, next) {

	const format = req.query.format;
	const start = parseInt(req.query.start);
	const count = parseInt(req.query.count);
	db.Incidents.find({}).limit(count).skip(start, function(err, incidents) {
		if (err) {
			if (format && format === "xml")
				res.send(json2xml(err))
			else
				res.send(err);
			return;
		}
		if (format && format === "xml")
			res.send(json2xml(incidents))
		else
			res.json(incidents)
	});
});

//GET active incidents
router.get('/active', function(req, res, next) {

	const format = req.query.format;
	const start = parseInt(req.query.start);
	const count = parseInt(req.query.count);
	db.Incidents.find({ active: true }).limit(count).skip(start, function(err, incidents) {
		if (err) {
			if (format && format === "xml")
				res.send(json2xml(err))
			else
				res.send(err);
			return;
		}
		if (format && format === "xml")
			res.send(json2xml(incidents))
		else
			res.json(incidents)
	});
});

//POST get auctions by filters
router.post('/filter', function(req, res, next) {
	
	console.log("api: incidents via filters");
	let query = {};
	query['$and'] = [];
	
	if (req.body.text != null)
		query['$and'].push({ $text: { $search: req.body.text }});
	
	if (req.body.priority != null) {

	}
	// 	query['$and'].push({ $or: [ {location: { name: req.body.region } }, { country: req.body.region }] });
	
	// if (req.body.minprice != null && req.body.maxprice != null)
	// 	query['$and'].push({ currently: { $gt: Number(req.body.minprice), $lt: Number(req.body.maxprice) }});
	// else if (req.body.minprice != null)
	// 	query['$and'].push({ currently: { $gt: Number(req.body.minprice) }});
	// else if (req.body.maxprice != null)
	// 	query['$and'].push({ currently: { $lt: Number(req.body.maxprice) }});
	
	// if (req.body.category != null)
	// 	query['$and'].push({ categories: { $in: [req.body.category] }});
	
	if (req.body.status != null)
		query['$and'].push({ active: req.body.status });
	
	db.Incidents.find(query, function(err, incidents) {
		if (err) {
			res.send(err);
			return;
		}
		res.status(200).json(incidents);
	});
});


//get incident by id
router.get('/:id', function(req, res, next) {

	const format = req.query.format;

	db.Incidents.findOne({ _id: mongojs.ObjectID(req.params.id) }, function(err, incident) {
		if (err) {
			if (format && format === "xml")
				res.send(json2xml(err))
			else
				res.send(err);
			return;
		}
		if (format && format === "xml")
			res.send(json2xml(incident));
		else
			res.json(incident)
	});
});


//get incident by priority
router.get('/priority/:priority', function(req, res, next) {

	db.Incidents.find({ priority: req.params.priority }, function(err, incidents) {
		if (err) {
			if (format && format === "xml")
				res.send(json2xml(err))
			else
				res.send(err);
			return;
		}
		if (format && format === "xml")
			res.send(json2xml(incidents))
		else
			res.json(incidents)
	});
});


// POST new incident
router.post('/', function(req, res, next) {

	const incParam = req.body;
	console.log(incParam);
	var location;

	opencage.geocode({q: incParam.address}).then(data => {
		if (data.status.code == 200) {
			if (data.results.length > 0) {
				var place = data.results[0];
				console.log(place.geometry);
				location = {
					longtitude : place.geometry.lng,
					latitude : place.geometry.lat
				};
				for (var i=0; i<incParam.auth.length; i++)
					incParam.auth[i] = parseInt(incParam.auth[i]);
				incident = db.Incidents.save({
					title: incParam.title,
					location: {
						address: incParam.address,
						longtitude: location.longtitude,
						latitude: location.latitude
					},
					priority: incParam.priority,
					date: new Date(),
					auth: incParam.auth,
					spots: 5,
					active: true,
					comments: [],
					officers: [],
					departments: [],
					stats: {
						deaths: 0,
						injured: 0,
						arrested: 0
					}
				}, function(err, incident) {
					if (err) {
						res.send(err);
						return;
					}
					/* incident saved */
					
					/* assign to users type 2 */
					console.log(incident.auth);
					db.Users.find({ userType : 2 , "details.authorityType" : { $in : incident.auth } }, function(err, users) {
						if (err) {
							res.json(incident);
							return;
						}
						users.forEach(user => {
							console.log(user);
							db.Users.update(
								{ _id: user._id },
								{ $push: { incidentRequests : incident._id } },
							function(err, incident) {
								// if (incident) {
								// 	res.send(incident);
								// 	return;
								// }
							});
						});
						res.json(incident);
					});
					// res.json(incident);
				})
			}
		} else {
			res.send(data.status.message);
		}
	}).catch(error => {
		console.log('error: ', error.message);
	});
	
});


//update incident
router.post('/update/:id', function(req, res, next) {

	console.log(req.body);
	const incParam = req.body;

	db.Incidents.update(
		{ _id: mongojs.ObjectID(req.params.id) },
		{
			$set: {
				description : incParam.description,
				callerName : incParam.callerName,
				callerNumber : incParam.callerNumber,
				keywords : incParam.keywords
			}
		}
	, function(err, incident) {
		if (err) {
			res.send(err);
			return;
		}
		res.json(incident);
	});
});


// POST accept request
router.post('/accept', function(req, res, next) {	

	const user_id = mongojs.ObjectID(req.body.user_id);
	const incident_id = mongojs.ObjectID(req.body.incident_id);

	db.Incidents.update(
		{
			_id: incident_id,
			spots: { $gt: 0 },
		},
		{
			$inc: { spots: -1 },
			$push: { officers: user_id }
		}
	, function(err, ret) {
		if (err) {
			res.status(401).json(err);
			return;
		}
		if (ret.nModified !== 0) {
			db.Users.update(
				{
					_id: user_id,
					userType: { $eq: 2 },
				},
				{
					$push: { acceptedIncidents: incident_id },
					$pull: { incidentRequests: incident_id }
				}
			, function(err, user) {
				if (err) {
					res.status(401).json(err);
					return;
				}
				res.status(200).json({
					msg : "Επιτυχής αποδοχή συμβάντος από τον χρήστη"
				});
			});
		} else {
			res.status(401).json({
				error: `Η ανάγκη για προσωπικό έχει καλυφθεί για το συμβάν!`
			});
		}
	});
});

// POST comment to incident
router.post('/comment', function(req, res, next) {

	const incident_id = mongojs.ObjectID(req.body.incident_id);
	const user_id = mongojs.ObjectID(req.body.user_id);
	const text = req.body.text;

	db.Incidents.update(
		{
			_id: incident_id
		},
		{
			$push: {
				comments: {
					user: user_id,
					date: new Date(),
					text: text
				}
			}
		}
	, function(err, ret) {
		if (err) {
			res.status(401).json(err);
			return;
		}
		res.status(200).json({
			msg : ret
		});
	});
});


module.exports = router;

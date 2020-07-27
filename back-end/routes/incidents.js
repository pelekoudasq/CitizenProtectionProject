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


/* routes */

// GET all incidents
router.get('/', function(req, res, next) {

	const format = req.query.format;
	const start = parseInt(req.query.start);
	const count = parseInt(req.query.count);
	db.Incidents.find({}).sort({ date: -1 }).limit(count).skip(start, function(err, incidents) {
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

// GET active incidents
router.get('/active', function(req, res, next) {

	const format = req.query.format;
	const start = parseInt(req.query.start);
	const count = parseInt(req.query.count);
	db.Incidents.find({ active: true }).sort({ date: -1 }).limit(count).skip(start, function(err, incidents) {
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


// GET IncidentLabels
router.get('/labels/', function(req, res, next) {

	const format = req.query.format;
	console.log('laaabeeelssssssssssssssssss');
	db.IncidentLabels.find({}, function(err, labels) {
		if (err) {
			if (format && format === "xml")
				res.send(json2xml(err))
			else
				res.send(err);
			return;
		}
		if (format && format === "xml")
			res.send(json2xml(labels))
		else
			res.json(labels)
	});
});


// GET active incidents of department
router.get('/department/:department_id', function(req, res, next) {

	const format = req.query.format;
	const start = parseInt(req.query.start);
	const count = parseInt(req.query.count);
	// const dept_id = ObjectID(req.body.dept_id);

	db.Incidents.find({ active: true, departments: req.params.department_id }).sort({ date: -1 }).limit(count).skip(start, function(err, incidents) {
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


// GET incidents of department
router.get('/department/all/:department_id', function(req, res, next) {

	const format = req.query.format;
	const start = parseInt(req.query.start);
	const count = parseInt(req.query.count);
	// const dept_id = ObjectID(req.body.dept_id);

	db.Incidents.find({ departments: req.params.department_id }).sort({ date: -1 }).limit(count).skip(start, function(err, incidents) {
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

// POST get auctions by filters
router.post('/filter', function(req, res, next) {

	console.log("api: incidents via filters");
	let query = {};	

	if (
		req.body.text || 
		req.body.priority.length || 
		(req.body.state.length && !req.body.state.find(element => element === "6")) ||
		(req.body.start_date && req.body.end_date) ||
		req.body.auth.length
	) {
		query['$and'] = [];
	}

	if (req.body.text)
		query['$and'].push({ $text: { $search: req.body.text }});
	
	if (req.body.priority.length) {
		prios = []
		req.body.priority.forEach(priority => {
			if (priority == "1")
				prios.push({ priority: "Χαμηλή"})
			if (priority == "2")
				prios.push({ priority: "Μέτρια"})
			if (priority == "3")
				prios.push({ priority: "Υψηλή"})
		});
		query['$and'].push({ $or: prios })
	}
	
	if (req.body.state.length) {
		if (req.body.state.find(element => element === "4")) {
			query['$and'].push({ active: false })
		} else if (req.body.state.find(element => element === "5")) {
			query['$and'].push({ active: true })
		}
	}
	
	var date_1, date_2;

	if (req.body.start_date)
		date_1 = new Date(req.body.start_date)

	if (req.body.end_date)
		date_2 = new Date(req.body.end_date)
	
	if (date_1 && date_2) {
		query['$and'].push({ date: { $gte: date_1, $lt: date_2 }});
	}

	//7, 8, 9, 10
	if (req.body.auth.length) {
		if (req.body.auth.find(element => element === "7"))
			query['$and'].push({ auth: { $all: ["0"] }});
		if (req.body.auth.find(element => element === "8"))
			query['$and'].push({ auth: { $all: ["1"] }});
		if (req.body.auth.find(element => element === "9"))
			query['$and'].push({ auth: { $all: ["2"] }});
		if (req.body.auth.find(element => element === "10"))
			query['$and'].push({ auth: { $all: ["3"] }});
	}

	db.Incidents.find(query).sort({ date: -1 }, function(err, incidents) {
		if (err) {
			res.send(err);
			return;
		}
		res.status(200).json(incidents);
	});
});


// DELETE incident by id
router.delete('/:id', function(req, res, next) {

	const format = req.query.format;

	db.Incidents.remove({ _id: mongojs.ObjectID(req.params.id) }, function(err, incident) {
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


// GET incident by id
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


// GET incidents by priority
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
	// console.log(incParam);
	var location;

	opencage.geocode({q: incParam.address}).then(data => {
		if (data.status.code == 200) {
			if (data.results.length > 0) {
				var place = data.results[0];
				// console.log(place.geometry);
				location = {
					longitude : place.geometry.lng,
					latitude : place.geometry.lat
				};
				for (var i = 0; i < incParam.auth.length; i++)
					incParam.auth[i] = parseInt(incParam.auth[i]);
				var spots;
				if (incParam.auth === "Χαμηλή") {
					// console.log(incParam.auth)
					spots = 2
				}
				else if (incParam.auth === "Μέτρια") {
					// console.log(incParam.auth)
					spots = 4
				}
				else {
					// console.log(incParam.auth)
					spots = 6
				}
				var description = null
				if (incParam.description)
					description = incParam.description
				if (incParam.x && incParam.y) {
					location.longitude = incParam.x;
					location.latitude = incParam.y;
				}
				var startDate = null
				if (incParam.startDate)
					startDate = incParam.startDate
				else
					startDate = new Date()
				var endDate = null
				if (incParam.endDate)
					endDate = incParam.endDate
				spots *= incParam.auth.length
				incident = db.Incidents.save({
					title: incParam.title,
					location: {
						address: incParam.address,
						longitude: location.longitude,
						latitude: location.latitude
					},
					description : description,
					priority: incParam.priority,
					date: startDate,
					auth: incParam.auth,
					spots: spots,
					active: true,
					comments: [],
					officers: [],
					departments: [],
					departmentReports: 0,
					stats: {
						deaths: 0,
						injured: 0,
						arrested: 0
					},
					end_date: endDate
				}, function(err, incident) {
					if (err) {
						res.send(err);
						return;
					}
					/* incident saved */
					
					/* assign to users type 2 */
					// console.log(incident.auth);
					db.Users.find({ userType : 2 , "details.authorityType" : { $in : incident.auth } }, function(err, users) {
						if (err) {
							res.json(incident);
							return;
						}
						users.forEach(user => {
							// console.log(user);
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


// POST update incident
router.post('/update/:id', function(req, res, next) {

	// console.log(req.body);
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

// POST edit incident
router.post('/edit', function(req, res, next) {

	console.log(req.body);
	const incParam = req.body;

	db.Incidents.update(
		{ _id: mongojs.ObjectID(incParam.incident_id) },
		{
			$set: {
				callerName : incParam.callerName,
				callerNumber : incParam.callerNumber,
				priority : incParam.priority
			}
		}
	, function(err, incident) {
		if (err) {
			res.status(401).json(err);
			return;
		}
		res.status(200).json({
			msg : incident
		});
	});
});

// POST edit auth of incident
router.post('/editAuth', function(req, res, next) {

	console.log(req.body);
	const incParam = req.body;
	db.Incidents.update(
		{ _id: mongojs.ObjectID(incParam.incident_id) },
		{
			$set: {
				auth : incParam.auth
			}
		}
	, function(err, incident) {
		if (err) {
			res.status(401).json(err);
			return;
		}
		res.status(200).json({
			msg : incident
		});
	});
});

// POST accept request
router.post('/accept', function(req, res, next) {	

	const user_id = mongojs.ObjectID(req.body.user_id);
	const incident_id = mongojs.ObjectID(req.body.incident_id);

	db.Users.findOne({ _id: user_id}, function(err, user) {
		if (err) {
			res.status(401).json(err);
			return;
		}
		console.log(user.details)
		db.Incidents.update(
			{
				_id: incident_id,
				spots: { $gt: 0 },
			},
			{
				$inc: { spots: -1 },
				$push: {
					officers: user_id,
					departments: user.details.departmentId
				},
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
			},
			$inc: {
				departmentReports: req.body.final_comment
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

// POST KE report to incident
router.post('/report', function(req, res, next) {

	const incident_id = mongojs.ObjectID(req.body.incident_id);
	const user_id = mongojs.ObjectID(req.body.user_id);
	const text = req.body.text;
	const stats = req.body.stats;

	db.Incidents.update(
		{
			_id: incident_id
		},
		{
			$set:{
				report: {
					user: user_id,
					date: new Date(),
					text: text
				},
				stats: {
					deaths: parseInt(stats.deaths),
					injured: parseInt(stats.injured),
					arrested: parseInt(stats.arrested)
				},
				active: false,
				end_date: new Date()
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

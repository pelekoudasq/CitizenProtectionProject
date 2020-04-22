// import packages
const express = require('express');
const mongojs = require('mongojs');
const opencage = require('opencage-api-client');


// import files
const config = require('../config.json');

// declare vars
const router = express.Router();
const db = mongojs(config.dburi);

//routes

//get all incidents
router.get('/all', function(req, res, next) {
	console.log('incidents: get all');
	db.Incidents.find(function(err, incidents) {
		if (err) {
			res.send(err);
			return;
		}
		res.json(incidents);
	})
})

//get incident by id
router.get('/:id', function(req, res, next) {
	console.log('incidents: get by id' );
	db.Incidents.findOne({ _id: mongojs.ObjectID(req.params.id) }, function(err, incident) {
		if (err) {
			res.send(err);
			return;
		}
		res.json(incident);
	})
})

//get incident by priority
router.get('/priority/:priority', function(req, res, next) {
	console.log('incidents: get by priority ' );
	db.Incidents.findOne({ priority: req.params.priority }, function(err, incident) {
		if (err) {
			res.send(err);
			return;
		}
		res.json(incident);
	})
})


//create new incident
router.post('/new', function(req, res, next) {
	console.log('incidents: create new incident ' );
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
			incident = db.Incidents.save({
				title: incParam.title,
				location : {
					address: incParam.address,
					longtitude: location.longtitude,
					latitude: location.latitude
				},
				priority: incParam.priority,
				date: new Date(),
				auth: incParam.auth,
				spots: 5,
				active: true
				
			}, function(err, incident) {
				if (err) {
					res.send(err);
					return;
				}

				//ASSIGNMENT//
				console.log(incident.auth);
				db.Users.find({ userType : 2 , "details.authorityType" : { $in : incident.auth } }, function(err, users) {
					if (err) {
						res.send(err);
						return;
					}
					users.forEach(user => {
						console.log(user);
						db.Users.update(
							{_id: user._id },
							{
								$push: {
									incidentRequest : incident._id
								}
							}
						,function(err, incident) {
							if (incident) {
								res.send(incident);
								return;
							}
						});
					});
				})

				

				//res.json(incident);
			})
		  }
		} else {
			res.send(data.status.message);
		}
	}).catch(error => {
		console.log('error', error.message);
	});
	
})

//update incident
router.post('/update/:id', function(req, res, next) {
	console.log('incidents: update incident ' );
	console.log(req.body);
	const incParam = req.body;
	db.Incidents.update(
		{_id: mongojs.ObjectID(req.params.id)},
		{
			$set: {
				description : incParam.description,
				callerName : incParam.callerName,
				callerNumber : incParam.callerNumber,
				keywords : incParam.keywords
			}
		}
	,function(err, incident) {
		if (incident) {
			res.send(incident);
			return;
		}
	});

})


module.exports = router;

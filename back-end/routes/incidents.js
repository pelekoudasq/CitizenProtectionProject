// import packages
const express = require('express');
const mongojs = require('mongojs');


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



module.exports = router;

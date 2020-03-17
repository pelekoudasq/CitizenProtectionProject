// import packages
const express = require('express');
const mongojs = require('mongojs');


// import files
const config = require('../config.json');

// declare vars
const router = express.Router();
console.log(config.dburi);
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


module.exports = router;

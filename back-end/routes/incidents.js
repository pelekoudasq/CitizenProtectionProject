// import packages
const express = require('express');

// import files


// declare vars
const router = express.Router();

//routes

//get all incidents
router.get('/all', function(req, res, next) {
	console.log('incidents: get all');
	res.json("hey incidents");
})


module.exports = router;

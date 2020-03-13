// import packages
const express = require('express');

// import files


// declare vars
const router = express.Router();

//routes

//get all users
router.get('/all', function(req, res, next) {
	console.log('users: get all');
	res.json("hey users");
})


module.exports = router;

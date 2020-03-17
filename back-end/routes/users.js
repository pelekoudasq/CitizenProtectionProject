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
	res.json("hey users");
})


module.exports = router;

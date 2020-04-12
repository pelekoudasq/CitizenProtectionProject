// import packages
const express = require('express');
const mongojs = require('mongojs');
// const opencage = require('opencage-api-client');


// import files
const config = require('../config.json');

// declare vars
const router = express.Router();
const db = mongojs(config.dburi);


// opencage.geocode({q: 'Γορτυνίας 23, Δήμος Αγίου Δημητρίου'}).then(data => {
//   // console.log(JSON.stringify(data));
//   if (data.status.code == 200) {
//     if (data.results.length > 0) {
//       var place = data.results[0];
//       // console.log(place);
//       console.log(place.formatted);
//       console.log(place.geometry);
//       // console.log(place.annotations.timezone.name);
//     }
//   } else {
//     // other possible response codes:
//     // https://opencagedata.com/api#codes
//     console.log('error', data.status.message);
//   }
// }).catch(error => {
//   console.log('error', error.message);
// });

//routes

//get all users
router.get('/all', function(req, res, next) {
	console.log('users: get all');
	db.Users.find(function(err, users) {
		if (err) {
			res.send(err);
			return;
		}
		res.json(users);
	})
})

//get user by id
router.get('/:id', function(req, res, next) {
	console.log('users: get by id');
	db.Users.find({ _id: mongojs.ObjectID(req.params.id) }, function(err, user) {
		if (err) {
			res.send(err);
			return;
		}
		res.json(user);
	})
})


module.exports = router;

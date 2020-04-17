// import packages
const express = require('express');
const fs = require("fs");
const https = require("https");
const bodyParser = require('body-parser');
const jwt = require('./jwt');

// import files
const users = require('./routes/users');
const incidents = require('./routes/incidents');

// declare vars
const options = {
	key: fs.readFileSync("./server.key"),
	cert: fs.readFileSync("./server.crt")
};

const app = express();
const port = 9000;

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
	next();
});

//Body Parsers middle ware
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb', extended: true}));

app.use('/users', users);
app.use('/incidents', incidents);

https.createServer(options, app).listen(port, function(){
	console.log(`Server started on port ${port}`);
});

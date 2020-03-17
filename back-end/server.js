// import packages
const express = require('express');
const fs = require("fs");
const https = require("https");

// import files
const users = require('./routes/users');
const incidents = require('./routes/incidents');

// declare vars
const options = {
	key: fs.readFileSync("./server.key"),
	cert: fs.readFileSync("./server.crt")
};
const app = express();
const port = 3000;

app.use('/users', users);
app.use('/incidents', incidents);


https.createServer(options, app).listen(port, function(){
	console.log(`Server started on port ${port}`);
});

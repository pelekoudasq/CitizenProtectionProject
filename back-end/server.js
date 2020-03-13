// import packages
const express = require('express');

// import files
const users = require('./routes/users');
const incidents = require('./routes/incidents');

// declare vars
const app = express();
const port = 3000;

app.use('/users', users);
app.use('/incidents', incidents);


app.listen(port, function(){
	console.log(`Server started on port ${port}`);
})

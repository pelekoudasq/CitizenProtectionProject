# Back End

Technologies - Packages:
----------------------
* Node.js
* Express.js
* bcrypt.js
* mongo.js

Database (MongoDB) runs remotely. It's configuration should be placed in the `./config.json` file

# Rest API

All endpoints handle the `format` query parameter with `json`(default) and `xml` as response format options.

## Open Endpoints

Open endpoints require no Authentication.


* Login : `POST /control-center/api/login/`
* Health Check : `GET /control-center/api/health-check/`

## Endpoints that require Authentication

Closed endpoints require a valid JWT token to be included in the header of the
request. A token can be acquired from the Login view above.


* Reset : `GET /control-center/api/reset/`
* Logout : `GET /control-center/api/logout/`

### User related

Each endpoint manipulates or displays information related to the `Users` collection:


* Get all Users : `GET /control-center/api/admin/users/` (Query Parameters: `start` and `count` for data pagination)
* Get User : `GET /control-center/api/admin/users/${USER_ID}`
* Add User : `POST /control-center/api/admin/users`
* Update User : `PUT /control-center/api/admin/users/${USER_ID}`
* Delete User : `DELETE /control-center/api/admin/users/${USER_ID}`
* Get Incident requests for User : `GET /control-center/api/admin/users/requests/${USER_ID}'`
* Get accepted Incidents from User : `GET /control-center/api/admin/users/accepted/${USER_ID}'`

### Incident related

Each endpoint manipulates or displays information related to the `Incidents` collection:

* Get all Incidents : `GET /control-center/api/incidents/` (Query Parameters: `start` and `count` for data pagination)
* Create new Incident : `POST /control-center/api/incidents/`
* Get single Incident : `GET /control-center/api/incidents/${INCIDENT_ID}`
* Get Incidents of Priority : `GET /control-center/api/incidents/${PRIORITY}`
* Update Incident: `POST /control-center/api/incidents/update/${INCIDENT_ID}`
* Accept Incident: `POST /control-center/api/incidents/accept`

import apiUrl from './apiUrl'

export const incidentService = {
    get_active_incidents,
    post_comment,
    post_report,
    get_user,
    get_filtered_incidents,
    get_user_requested_incidents,
    accept_incident,
    get_user_accepted_incidents
};



function authHeader() 
{
    // return authorization header with jwt token
    const token = localStorage.getItem('token');
    if (token) {
        return { Authorization: `Bearer ${token}` };
    } 
    else 
    {
        return {};
    }
}


function get_active_incidents(start, count) { //only control center makes this call

	const requestOptions = {
		mode: 'cors',
		method: 'GET',
		headers: authHeader(),
	};

    return fetch(`${apiUrl}/incidents/active?start=${start}&count=${count}`, requestOptions)
    .then(response => response.json())
    .then(response => {
        return response;
    });	

}

function accept_incident(incident_id) //only employees make this call
{
    const user_id = localStorage.getItem('userid'); 
	const requestOptions = {
		mode: 'cors',
		method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            user_id,
            incident_id
        }),
	};
    requestOptions.headers['Content-Type'] = 'application/json'   

    return fetch(`${apiUrl}/incidents/accept`, requestOptions)
    .then(response => response.json())
    .then(response => {
        return response;
    });	

}

function get_user_accepted_incidents() //only employees make this call
{
    const user_id = localStorage.getItem('userid'); 
	const requestOptions = {
		mode: 'cors',
		method: 'GET',
        headers: authHeader(),
	};
    requestOptions.headers['Content-Type'] = 'application/json'   

    return fetch(`${apiUrl}/admin/users/accepted/${user_id}`, requestOptions)
    .then(response => response.json())
    .then(response => {
        return response;
    });	

}

function get_user_requested_incidents() //only employees make this call
{
    const user_id = localStorage.getItem('userid'); 
	const requestOptions = {
		mode: 'cors',
		method: 'GET',
		headers: authHeader(),
	};

    return fetch(`${apiUrl}/admin/users/requests/${user_id}`, requestOptions)
    .then(response => response.json())
    .then(response => {
        return response;
    });	

}


function get_filtered_incidents(text, priority, state, start_date, end_date) {

	const requestOptions = {
		mode: 'cors',
		method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            text,
            priority,
            state,
            start_date,
            end_date
        }),
	};
    requestOptions.headers['Content-Type'] = 'application/json'    

    return fetch(`${apiUrl}/incidents/filter`, requestOptions)
    .then(response => response.json())
    .then(response => {
        return response;
    });	

}


function post_comment(text, incident_id) {

    const user_id = localStorage.getItem('userid');

    const requestOptions = {
            mode: 'cors',
            method: 'POST',
            headers: authHeader(),
            body: JSON.stringify({
                text,
                incident_id,
                user_id
            }),
        }

    requestOptions.headers['Content-Type'] = 'application/json'    

    return fetch(`${apiUrl}/incidents/comment`, requestOptions)
    .then(response => response.json())
    .then(response => {
        return response;
    }); 

}

function post_report(text, incident_id, stats) {

    const user_id = localStorage.getItem('userid');

    const requestOptions = {
            mode: 'cors',
            method: 'POST',
            headers: authHeader(),
            body: JSON.stringify({
                text,
                incident_id,
                user_id,
                stats
            }),
        }

    requestOptions.headers['Content-Type'] = 'application/json'

    return fetch(`${apiUrl}/incidents/report`, requestOptions)
    .then(response => response.json())
    .then(response => {
        return response;
    });

}


function get_user(userid) {

    const requestOptions = {
        mode: 'cors',
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${apiUrl}/admin/users/${userid}`, requestOptions)
    .then(response => response.json())
    .then(response => {
        return response;
    }); 

}



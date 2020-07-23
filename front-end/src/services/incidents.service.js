import apiUrl from './apiUrl'

export const incidentService = {
    get_all_incidents,
    get_active_incidents,
    accept_incident,
    get_user_accepted_incidents,
    get_user_requested_incidents,
    get_filtered_incidents,
    edit_incident,
    post_comment,
    post_report,
    get_user,
    get_incident,
    change_auth,
    get_department_incidents 
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


function get_all_incidents(start, count) { //only control center makes this call

	const requestOptions = {
		mode: 'cors',
		method: 'GET',
		headers: authHeader(),
	};

    return fetch(`${apiUrl}/incidents/?start=${start}&count=${count}`, requestOptions)
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


function get_department_incidents(start, count) //only departments make this call
{
    const department_id = localStorage.getItem('userid'); 
	const requestOptions = {
		mode: 'cors',
		method: 'GET',
		headers: authHeader(),
	};

    return fetch(`${apiUrl}/incidents/department/${department_id}?start=${start}&count=${count}`, requestOptions)
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

function edit_incident(callerName, callerNumber, priority, incident_id) {

    const requestOptions = {
        mode: 'cors',
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            incident_id,
            callerName,
            callerNumber,
            priority
        }),
    };
    
    requestOptions.headers['Content-Type'] = 'application/json'

    return fetch(`${apiUrl}/incidents/edit`, requestOptions)
    .then(response => response.json())
    .then(response => {
        return response;
    });
}

function post_comment(text, incident_id, final) {

    const user_id = localStorage.getItem('userid');

    const requestOptions = {
        mode: 'cors',
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            text,
            incident_id,
            user_id,
            final
        }),
    };

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
    };

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

function get_incident(incident_id) {

    const requestOptions = {
        mode: 'cors',
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${apiUrl}/incidents/${incident_id}`, requestOptions)
    .then(response => response.json())
    .then(response => {
        return response;
    }); 
}

function change_auth(auth, incident_id) {

    const requestOptions = {
        mode: 'cors',
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            incident_id,
            auth
        }),
    };

    requestOptions.headers['Content-Type'] = 'application/json'

    return fetch(`${apiUrl}/incidents/editAuth`, requestOptions)
    .then(response => response.json())
    .then(response => {
        return response;
    });
}

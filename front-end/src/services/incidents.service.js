import apiUrl from './apiUrl'

export const incidentService = {
    get_active_incidents,
    post_comment,
    get_user,
    get_filtered_incidents
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


function get_active_incidents(start, count) {

	const requestOptions = {
		mode: 'cors',
		method: 'GET',
		headers: authHeader(),
	};

    return fetch(`${apiUrl}/incidents?start=${start}&count=${count}`, requestOptions)
    .then(response => response.json())
    .then(response => {
        return response;
    });	

}


function get_filtered_incidents(text, priority, state, incident_date) {

	const requestOptions = {
		mode: 'cors',
		method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            text,
            priority,
            state,
            incident_date
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



import apiUrl from './apiUrl'

export const incidentService = {
	get_incidents
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


function get_incidents(start, count) {

	const requestOptions = {
		mode: 'cors',
		method: 'GET',
		headers: authHeader(),
	};

    return fetch(`${apiUrl}/incidents?start=${start}?count=${count}`, requestOptions)
    .then(response => response.json())
    .then(response => {
        return response;
    });	

}
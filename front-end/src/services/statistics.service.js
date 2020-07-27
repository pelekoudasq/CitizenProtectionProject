import apiUrl from './apiUrl'

export const statisticsService = {
    get_authorities
};

function authHeader() {

    // return authorization header with jwt token
    const token = localStorage.getItem("token");
    if (token) {
        return { Authorization: `Bearer ${token}` };
    } else {
        return {};
    }
}

function get_authorities() { //only control center makes this call

	const requestOptions = {
		mode: 'cors',
		method: 'GET',
		headers: authHeader(),
	};

    return fetch(`${apiUrl}/authorities`, requestOptions)
    .then(response => response.json())
    .then(response => {
        return response;
    });	

}

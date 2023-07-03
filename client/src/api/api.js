import axios from "axios";


export const $api = axios.create({
	baseURL: 'http://localhost:3000/api',
})

$api.interceptors.request.use((config) => {
	if (!config.headers.Authorization) {
		config.headers.Authorization = `Bearer ${localStorage.getItem('jwt')}`
	}
	return config;
})
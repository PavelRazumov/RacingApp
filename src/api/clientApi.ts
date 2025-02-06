import axios from 'axios';

const API_BASE_URL = 'http://ergast.com/api/f1';

export const clientApi = axios.create({
    baseURL: API_BASE_URL,
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json',
    },
});

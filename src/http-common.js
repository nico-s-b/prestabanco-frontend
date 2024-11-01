import axios from "axios";

const prestabancoBackendServer = import.meta.env.VITE_PRESTABANCO1_BACKEND_SERVER;
const prestabancoBackendPort = import.meta.env.MODE === 'production' 
    ? '' 
    : `:${import.meta.env.VITE_PRESTABANCO1_BACKEND_PORT || 80}`;

const baseURL = `http://${prestabancoBackendServer}${prestabancoBackendPort}`;

const httpClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default httpClient;
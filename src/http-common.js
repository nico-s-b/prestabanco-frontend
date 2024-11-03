import axios from "axios";

const prestabancoBackendServer = import.meta.env.VITE_PRESTABANCO1_BACKEND_SERVER;
const prestabancoBackendPort = import.meta.env.VITE_PRESTABANCO1_BACKEND_PORT;

//console.log(prestabancoBackendServer)
//console.log(prestabancoBackendPort)

const httpClient = axios.create({
    baseURL: `http://${prestabancoBackendServer}:${prestabancoBackendPort}`,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default httpClient;
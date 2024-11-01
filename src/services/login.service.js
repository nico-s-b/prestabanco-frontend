import axios from "../http-common";

const login = async (data) => {
    const response = await axios.post('/api/auth/login', data);
    //Almacenar token si login exitoso
    if (response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', response.data.userType);
        localStorage.setItem('name', response.data.name);
        return true; 
    }
    return false;
};

const currentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("Token no encontrado en localStorage.");
    }    
    return axios.get('/api/auth/current-user', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const logout = () => {
    //Eliminar token para cerrar sesión
    localStorage.removeItem('token'); 
    localStorage.removeItem('userId'); 
    return axios.post('/api/auth/logout');
};

export default { login, currentUser, logout };

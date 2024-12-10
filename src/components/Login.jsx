import React, { useState } from "react";
import loginService from "../services/login.service";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("CLIENT");  
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const data = { email, password, userType };
    try {
      const response = await loginService.login(data, userType);
      console.log("Login exitoso:", response.data);

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("Token no encontrado en localStorage");
        }

        const currentUserResponse = await loginService.currentUser();
        localStorage.setItem('userId', currentUserResponse.data.userId);
        
        window.dispatchEvent(new Event("storage"));
        navigate("/home");
      
    } catch (error) {
      const errorMessage = error.response && error.response.data 
                           ? error.response.data.error || "Error en la autenticación" 
                           : "Error en la autenticación";
      setError(errorMessage);    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="email"> Email: </label>
          <input 
            type="text" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required/>
        </div>

        <div>
          <label htmlFor="password"> Contraseña: </label>
          <input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required/>
        </div>
        
        <div>
          <label htmlFor="userType">Tipo de Usuario:</label>
          <select
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="CLIENT">Cliente</option>
            <option value="EXECUTIVE">Ejecutivo</option>
          </select>
        </div>

        <button type="submit"> Login </button>
        </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;

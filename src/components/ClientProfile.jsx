import React, { useEffect, useState } from "react";
import axios from "../http-common";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ClientProfile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [credits, setCredits] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(`/api/v1/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setUserInfo(response.data);
        } catch (error) {
          console.error("Error al obtener la información del usuario:", error);
        }
        try{
          const response = await axios.get(`/api/v1/credits/${userId}/credits`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          console.log(response.data);
          setCredits(response.data);
        } catch (error) {
          console.error("Error al obtener la información del usuario:", error);
        } 

      }
    };

    fetchUserData();
  }, []);

  const handleInfoClick = () => {
    const userId = localStorage.getItem("userId");
    navigate(`/client/info/${userId}`);
  }

  const handleEditClick = (id) => {
    navigate(`/credit/edit/${id}`);
  }

  return (
    <div>
      <h1>Client Profile</h1>
      {userInfo ? (
        <>
          <div>
            <p>Nombre: {userInfo.name} {userInfo.paternalLastname} {userInfo.maternalLastname}</p>
            <p>Email: {userInfo.email}</p>
            <p>Teléfono: {userInfo.phone}</p>
            <p>Fecha de Nacimiento: {format(new Date(userInfo.birthDate), 'dd-MM-yyyy')}</p>
            <p>RUT: {userInfo.rut}</p>
          </div>
          <Button 
            variant="contained"
            color="info"
            onClick={handleInfoClick}
            startIcon={<EditIcon />}
            >
              Completar Información Financiera</Button>
          </>
      ) : (
        <p>Cargando la información del usuario...</p>
      )}
  
      <div>
        {credits ? (
          <><p>Lista de créditos</p>
          <TableContainer component={Paper}>
            <br />
            <br /> <br />
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Nro
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Tipo de crédito
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Monto
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Plazo (años)
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Estado
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Operaciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {credits.map((credit, index) => (
                  <TableRow
                    key={credit.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{index + 1}</TableCell>
                    <TableCell align="left">{credit.creditType}</TableCell>
                    <TableCell align="right">{credit.creditMount}</TableCell>
                    <TableCell align="right">{credit.loanPeriod}</TableCell>
                    <TableCell align="right">{credit.state}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="info"
                        size="small"
                        onClick={() => handleEditClick(credit.id)}
                        style={{ marginLeft: "0.5rem" }}
                        startIcon={<EditIcon />}
                      >
                        Editar
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(credit.id)}
                        style={{ marginLeft: "0.5rem" }}
                        startIcon={<DeleteIcon />}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer></>

        ) : (
          <p>No posee créditos</p>
        )}
      </div>
    </div>
  );
};

export default ClientProfile;
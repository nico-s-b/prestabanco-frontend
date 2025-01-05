import React, { useState, useEffect } from 'react';
import evaluationService from '../services/evaluation.service'; 
import { formatISO, format, parseISO  } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Typography,
  Box,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';

const ClientInfo = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [clientInfoData, setClientInfoData] = useState({
    monthlyIncome: "",
    lastTwoYearIncome: "",
    totalDebt: "",
    lastDebtDate: "",
    isEmployee: false,
    currentJobStartDate: "",
    lastJobEndDate: "",
    accountBalance: "",
    accountStartDate: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientInfo = await evaluationService.getClientInfo(userId);

        if (clientInfo.data) {
          setClientInfoData({
            ...clientInfo.data,
            lastDebtDate: clientInfo.data.lastDebtDate
              ? format(parseISO(clientInfo.data.lastDebtDate), "yyyy-MM-dd")
              : "",
            currentJobStartDate: clientInfo.data.currentJobStartDate
              ? format(parseISO(clientInfo.data.currentJobStartDate), "yyyy-MM-dd")
              : "",
            lastJobEndDate: clientInfo.data.lastJobEndDate
              ? format(parseISO(clientInfo.data.lastJobEndDate), "yyyy-MM-dd")
              : "",
            accountStartDate: clientInfo.data.accountStartDate
              ? format(parseISO(clientInfo.data.accountStartDate), "yyyy-MM-dd")
              : "",
          });
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientInfoData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateValues = (clientInfoData, setError) => {
    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Formateo de fechas para el backend
    const formattedClientInfoData = {
      ...clientInfoData,
      lastDebtDate: clientInfoData.lastDebtDate
        ? formatISO(new Date(clientInfoData.lastDebtDate))
        : null,
      currentJobStartDate: clientInfoData.currentJobStartDate
        ? formatISO(new Date(clientInfoData.currentJobStartDate))
        : null,
      lastJobEndDate: clientInfoData.lastJobEndDate
        ? formatISO(new Date(clientInfoData.lastJobEndDate))
        : null,
      accountStartDate: clientInfoData.accountStartDate
        ? formatISO(new Date(clientInfoData.accountStartDate))
        : null,
    };

    try {
      await evaluationService.saveClientInfo(formattedClientInfoData);
      alert("Datos actualizados correctamente");
      navigate(`/client/${userId}`);
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      alert("Error al actualizar los datos");
    }
  };

  if (isLoading) {
    return <p>Cargando datos...</p>;
  }

  if (isLoading) {
    return <Typography>Cargando datos...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* Situación laboral */}
        <Grid item xs={12}>
          <Typography variant="h6">Situación Laboral</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography>¿Está trabajando actualmente?</Typography>
          <RadioGroup
            row
            name="isWorking"
            value={clientInfoData.isWorking}
            onChange={handleInputChange}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Sí" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </Grid>

        {clientInfoData.isWorking === "yes" && (
          <>
            <Grid item xs={12}>
              <Typography>¿Es empleado dependiente?</Typography>
              <RadioGroup
                row
                name="isEmployee"
                value={clientInfoData.isEmployee}
                onChange={handleInputChange}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Sí" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </Grid>

            {clientInfoData.isEmployee === "yes" && (
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Fecha Inicio Trabajo Actual"
                    name="currentJobStartDate"
                    type="date"
                    value={clientInfoData.currentJobStartDate}
                    onChange={handleInputChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Ingreso Mensual"
                    name="monthlyIncome"
                    type="number"
                    value={clientInfoData.monthlyIncome}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
              </>
            )}

            {clientInfoData.isEmployee === "no" && (
              <Grid item xs={12}>
                <TextField
                  label="Ingreso Últimos 2 Años"
                  name="lastTwoYearIncome"
                  type="number"
                  value={clientInfoData.lastTwoYearIncome}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
            )}
          </>
        )}

        {clientInfoData.isWorking === "no" && (
          <Grid item xs={12}>
            <TextField
              label="Fecha Fin Último Trabajo"
              name="lastJobEndDate"
              type="date"
              value={clientInfoData.lastJobEndDate}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        )}

        {/* Situación financiera */}
        <Grid item xs={12}>
          <Typography variant="h6">Situación Financiera</Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Deuda Total"
            name="totalDebt"
            type="number"
            value={clientInfoData.totalDebt}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Fecha Última Deuda"
            name="lastDebtDate"
            type="date"
            value={clientInfoData.lastDebtDate}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Ahorros */}
        <Grid item xs={12}>
          <Typography variant="h6">Ahorros</Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Saldo Cuenta de Ahorro"
            name="accountBalance"
            type="number"
            value={clientInfoData.accountBalance}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Fecha Inicio Cuenta de Ahorro"
            name="accountStartDate"
            type="date"
            value={clientInfoData.accountStartDate}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} textAlign="center">
          <Button variant="contained" color="primary" type="submit">
            Guardar
          </Button>
        </Grid>
      </Grid>
    </form>
  </Box>
  );
};

export default ClientInfo;

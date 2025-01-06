import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import evaluationService from "../services/evaluation.service";

const ClientInfo = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [clientInfoData, setClientInfoData] = useState({
    monthlyIncome: "",
    lastTwoYearIncome: "",
    totalDebt: "",
    lastDebtDate: "",
    isEmployee: true,
    currentJobStartDate: "",
    accountBalance: "",
    accountStartDate: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const today = format(new Date(), "yyyy-MM-dd");

  // Función para formatear números para visualización
  const formatNumber = (value) => {
    return value ? parseInt(value, 10).toLocaleString("es-CL") : "";
  };

  // Función para desformatear números para almacenamiento
  const unformatNumber = (value) => {
    return value.replace(/\D/g, ""); // Elimina caracteres no numéricos
  };

  // Maneja cambios en campos, separando lógica de valores monetarios
  const handleChange = (e, setter, max = null) => {
    const { value } = e.target;
    const unformattedValue = unformatNumber(value);

    if (/^\d*$/.test(unformattedValue)) {
      const numericValue = parseInt(unformattedValue, 10);

      if (max && numericValue > max) {
        alert(`El valor no puede ser mayor a ${max.toLocaleString("es-CL")}`);
        setter(max.toString());
      } else {
        setter(unformattedValue);
      }
    }
  };

  // Maneja cambios en campos booleanos o texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setClientInfoData((prevData) => ({
      ...prevData,
      [name]:
        name === "isEmployee" ? value === "true" : value, // Convierte isEmployee a booleano
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientInfo = await evaluationService.getClientInfo(userId);
        if (clientInfo.data) {
          setClientInfoData({
            ...clientInfo.data,
            isEmployee: !!clientInfo.data.isEmployee, // Convierte a booleano
            monthlyIncome: clientInfo.data.monthlyIncome || "",
            lastTwoYearIncome: clientInfo.data.lastTwoYearIncome || "",
            totalDebt: clientInfo.data.totalDebt || "",
            accountBalance: clientInfo.data.accountBalance || "",
            lastDebtDate: clientInfo.data.lastDebtDate
              ? format(parseISO(clientInfo.data.lastDebtDate), "yyyy-MM-dd")
              : "",
            currentJobStartDate: clientInfo.data.currentJobStartDate
              ? format(parseISO(clientInfo.data.currentJobStartDate), "yyyy-MM-dd")
              : "",
            accountStartDate: clientInfo.data.accountStartDate
              ? format(parseISO(clientInfo.data.accountStartDate), "yyyy-MM-dd")
              : "",
          });
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedClientInfoData = {
      ...clientInfoData,
      clientId: userId,
    };

    try {
      await evaluationService.updateClientInfo(formattedClientInfoData);
      alert("Datos actualizados correctamente");
      navigate(`/client/${userId}`);
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      alert("Error al actualizar los datos");
    }
  };

  if (isLoading) {
    return <Typography>Cargando datos...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Situación laboral */}
          <Grid item xs={12}>
            <Typography variant="h6">Situación Laboral</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography>¿Es empleado dependiente?</Typography>
            <RadioGroup
              row
              name="isEmployee"
              value={clientInfoData.isEmployee.toString()}
              onChange={handleInputChange}
              required
            >
              <FormControlLabel value="true" control={<Radio />} label="Sí" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </Grid>

          {clientInfoData.isEmployee && (
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
                  inputProps={{ max: today }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Ingreso Mensual"
                  name="monthlyIncome"
                  type="text"
                  value={formatNumber(clientInfoData.monthlyIncome)}
                  onChange={(e) => handleChange(e, (value) => setClientInfoData((prev) => ({
                    ...prev,
                    monthlyIncome: value,
                  })))}
                  fullWidth
                />
              </Grid>
            </>
          )}

          {!clientInfoData.isEmployee && (
            <Grid item xs={12}>
              <TextField
                label="Ingreso Últimos 2 Años"
                name="lastTwoYearIncome"
                type="text"
                value={formatNumber(clientInfoData.lastTwoYearIncome)}
                onChange={(e) => handleChange(e, (value) => setClientInfoData((prev) => ({
                  ...prev,
                  lastTwoYearIncome: value,
                })))}
                fullWidth
              />
            </Grid>
          )}

          {/* Situación financiera */}
          <Grid item xs={12}>
            <Typography variant="h6">Situación Financiera</Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Monto mensual en deudas"
              name="totalDebt"
              type="text"
              value={formatNumber(clientInfoData.totalDebt)}
              onChange={(e) => handleChange(e, (value) => setClientInfoData((prev) => ({
                ...prev,
                totalDebt: value,
              })))}
              fullWidth
              required
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
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: today }}
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
              type="text"
              value={formatNumber(clientInfoData.accountBalance)}
              onChange={(e) => handleChange(e, (value) => setClientInfoData((prev) => ({
                ...prev,
                accountBalance: value,
              })))}
              fullWidth
              required
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
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: today }}
            />
          </Grid>

          <Grid item xs={12} textAlign="center">
            <Button variant="contained" color="primary" type="submit">
              Guardar
            </Button>
          </Grid>
        </Grid>
      </form>
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default ClientInfo;

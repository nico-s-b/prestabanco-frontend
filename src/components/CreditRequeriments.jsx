import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const LoanRequirementsTable = () => {
  const loanData = [
    {
      type: "Primera Vivienda",
      maxTerm: "30 años",
      interestRate: "3.5% - 5.0%",
      maxFinancing: "80% del valor de la propiedad",
      documents: "Comprobante de ingresos, Certificado de avalúo, Historial crediticio",
    },
    {
      type: "Segunda Vivienda",
      maxTerm: "20 años",
      interestRate: "4.0% - 6.0%",
      maxFinancing: "70% del valor de la propiedad",
      documents: "Comprobante de ingresos, Certificado de avalúo, Historial crediticio",
    },
    {
      type: "Propiedades Comerciales",
      maxTerm: "25 años",
      interestRate: "5.0% - 7.0%",
      maxFinancing: "60% del valor de la propiedad",
      documents: "Comprobante de ingresos, Certificado de avalúo, Escritura de la primera vivienda, Historial crediticio",
    },
    {
      type: "Remodelación",
      maxTerm: "15 años",
      interestRate: "4.5% - 6.0%",
      maxFinancing: "50% del valor actual de la propiedad",
      documents: "Comprobante de ingresos, Presupuesto de la remodelación, Certificado de avalúo actualizado",
    },
  ];

  return (
    <TableContainer component={Paper} sx={{ margin: "0 auto", maxWidth: "100%" }}>
      <Typography variant="h6" sx={{ margin: 2 }} align="center">
        Requerimientos y Condiciones Generales de los Tipos de Crédito
      </Typography>
      <Table aria-label="Loan Requirements Table">
        <TableHead>
          <TableRow>
            <TableCell>Tipo de Crédito</TableCell>
            <TableCell>Plazo Máximo</TableCell>
            <TableCell>Tasa de Interés (Anual)</TableCell>
            <TableCell>Monto Máximo Financiamiento</TableCell>
            <TableCell>Documentos Requeridos</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loanData.map((loan, index) => (
            <TableRow key={index}>
              <TableCell>{loan.type}</TableCell>
              <TableCell>{loan.maxTerm}</TableCell>
              <TableCell>{loan.interestRate}</TableCell>
              <TableCell>{loan.maxFinancing}</TableCell>
              <TableCell>{loan.documents}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LoanRequirementsTable;
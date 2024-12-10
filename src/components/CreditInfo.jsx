import React from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";
import { getCreditState, getCreditType } from "./CreditUtils";

const CreditInfo = ({ creditInfo, tracking }) => {
  return (
    <div>
      {creditInfo && tracking ? (
        <>
          <TableContainer component={Paper} sx={{ width: "60%", margin: "0 auto" }}>
            <Table aria-label="credit info table">
              <TableBody>
                <TableRow>
                  <TableCell>Tipo de crédito</TableCell>
                  <TableCell>{getCreditType(creditInfo.creditType)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Valor de Propiedad</TableCell>
                  <TableCell>{creditInfo.propertyValue.toLocaleString("es-CL")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Monto</TableCell>
                  <TableCell>{creditInfo.creditMount.toLocaleString("es-CL")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Plazo</TableCell>
                  <TableCell>{creditInfo.loanPeriod} años</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Interés anual</TableCell>
                  <TableCell>{creditInfo.annualRate} %</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Fecha de solicitud</TableCell>
                  <TableCell>{format(new Date(creditInfo.requestDate), "dd-MM-yyyy")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Fecha de última actualización</TableCell>
                  <TableCell>{tracking ? format(new Date(tracking.lastUpdateDate), "dd-MM-yyyy") : "Cargando..."}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Estado de solicitud</TableCell>
                  <TableCell>{tracking ? getCreditState(tracking.state) : "Cargando..."}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <p>Cargando información...</p>
      )}
    </div>
  );
};

export default CreditInfo;

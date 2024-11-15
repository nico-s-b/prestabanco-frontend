import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import { getCreditState, getCreditType, getRequiredDocumentsCount } from "./CreditUtils";

const CreditTable = ({ credits, handleEditClick, handleDelete }) => {
  return (
    <div>
      {credits && credits.length > 0 ? (
        <>
          <p>Solicitudes de crédito</p>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>Nro</TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>Tipo de crédito</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Monto</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Plazo (años)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Interés (anual)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Fecha solicitud</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Última actualización</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Estado</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Documentos</TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>Operaciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {credits.map((credit, index) => {
                const requiredDocumentsCount = getRequiredDocumentsCount(credit.creditType);
                const uploadedDocumentsCount = credit.documents ? credit.documents.length : 0;
                return (
                <TableRow key={credit.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell align="left">{index + 1}</TableCell>
                    <TableCell align="left">{getCreditType(credit.creditType)}</TableCell>
                    <TableCell align="right">{credit.creditMount.toLocaleString("es-CL")}</TableCell>
                    <TableCell align="right">{credit.loanPeriod}</TableCell>
                    <TableCell align="right">{credit.annualRate}</TableCell>
                    <TableCell align="right">{format(new Date(credit.requestDate), 'dd-MM-yyyy')}</TableCell>
                    <TableCell align="right">{format(new Date(credit.lastUpdateDate), 'dd-MM-yyyy')}</TableCell>
                    <TableCell align="right">{getCreditState(credit.state)}</TableCell>
                    <TableCell align="right">{`${uploadedDocumentsCount}/${requiredDocumentsCount}`}</TableCell>
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
                );
            })}
            </TableBody>
        </Table>
        </TableContainer>
    </>
    ) : (
    <p>No posee créditos</p>
    )}
</div>
  );
};

export default CreditTable;
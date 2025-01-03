import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import BlockIcon from "@mui/icons-material/Block";
import { format } from "date-fns";
import { getCreditState, getCreditType, getRequiredDocumentsCount } from "./CreditUtils";

const CreditTable = ({ credits, trackings, handleEditClick, handleCancelClick , handleConditionsClick , handleRejectClick }) => {

  const statesCancel = ["INITIALREV", "PENDINGDOCUMENTATION", "EVALUATING", "PREAPROVAL" ,  "FINALAPROVAL"];
  const statesEdit = ["INITIALREV", "PENDINGDOCUMENTATION"];
  const statesConditions = ["PREAPROVAL", "FINALAPROVAL", "APROVED", "INOUTLAY"];
  const statesReject = ["REJECTED"];

  const CancelButton = ({ onClick }) => (
    <Tooltip title="Cancelar crédito">
      <IconButton
        onClick={onClick}
        sx={{
          color: "rgba(255, 99, 71, 0.8)", // Rojo suave
          "&:hover": {
            backgroundColor: "rgba(255, 99, 71, 0.1)",
          },
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
  
  const EditButton = ({ onClick }) => (
    <Tooltip title="Editar crédito">
      <IconButton
        onClick={onClick}
        sx={{
          color: "info.main",
          "&:hover": {
            backgroundColor: "rgba(0, 123, 255, 0.1)",
          },
        }}
      >
        <EditIcon />
      </IconButton>
    </Tooltip>
  );
  
  const ConditionsButton = ({ onClick }) => (
    <Tooltip title="Ver condiciones">
      <IconButton
        onClick={onClick}
        sx={{
          color: "success.main",
          "&:hover": {
            backgroundColor: "rgba(40, 167, 69, 0.1)",
          },
        }}
      >
        <InfoIcon />
      </IconButton>
    </Tooltip>
  );
  

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
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Monto solicitado</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Plazo (años)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Interés (anual)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Fecha solicitud</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Última actualización</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Estado</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>Documentos subidos</TableCell>
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {credits.map((credit, index) => {
                const tracking = trackings.find((t) => t.creditId === credit.id);
                return (
                <TableRow key={credit.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell align="left">{index + 1}</TableCell>
                    <TableCell align="left">{getCreditType(credit.creditType)}</TableCell>
                    <TableCell align="right">{credit.creditMount.toLocaleString("es-CL")}</TableCell>
                    <TableCell align="right">{credit.loanPeriod}</TableCell>
                    <TableCell align="right">{credit.annualRate}</TableCell>
                    <TableCell align="right">{format(new Date(credit.requestDate), 'dd-MM-yyyy')}</TableCell>
                    <TableCell align="right">{tracking ? format(new Date(tracking.lastUpdateDate), 'dd-MM-yyyy') : "N/A"}</TableCell>
                    <TableCell align="right">{tracking ? getCreditState(tracking.state) : "Sin estado"}</TableCell>
                    <TableCell align="right">
                      {tracking 
                        ? `${tracking.docsUploaded} / ${getRequiredDocumentsCount(credit.creditType)}` 
                        : "N/A"}
                    </TableCell>

                    <TableCell>
                      <Box 
                        sx={{ 
                          display: "flex", 
                          justifyContent: "center", 
                          alignItems: "center", 
                          gap: 1
                        }}
                      >
                        {tracking && statesConditions.includes(tracking.state) && (
                          <ConditionsButton onClick={() => handleConditionsClick(credit.id)} />
                        )}                        
                        {tracking && statesEdit.includes(tracking.state) && (
                          <EditButton onClick={() => handleEditClick(credit.id)} />
                        )} 
                        {tracking && statesCancel.includes(tracking.state) && (
                          <CancelButton onClick={() => handleCancelClick(credit.id)} />
                        )}
                        {tracking && statesReject.includes(tracking.state) && (
                          <RejectButton onClick={() => handleRejectClick(credit.id)} />
                        )}
                      </Box>
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
import React , {useState} from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button , Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { format } from "date-fns";
import { getCreditState, getCreditType, getRequiredDocumentsCount } from "./CreditUtils";

const CreditTableExec = ({ credits, trackings, handleEvalClick }) => {
  const evaluationStates = ["EVALUATING","FINALAPROVAL","APROVED"]
  const statesComment = ["REJECTED", "PENDINGDOCUMENTATION", "APROVED", "INOUTLAY"];

  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [currentComments, setCurrentComments] = useState("");
  const CommentButton = ({ onClick }) => (
    <Tooltip title="Ver comentarios">
      <IconButton
        onClick={onClick}
        sx={{
          color: "rgba(255, 193, 7, 0.8)", // Amarillo suave
          "&:hover": {
            backgroundColor: "rgba(255, 193, 7, 0.1)",
          },
        }}
      >
        <NewReleasesIcon />
      </IconButton>
    </Tooltip>
  );

  const handleOpenCommentDialog = (comments) => {
    setCurrentComments(comments);
    setOpenCommentDialog(true);
  };
  
  const handleCloseCommentDialog = () => {
    setOpenCommentDialog(false);
    setCurrentComments("");
  };  

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
                          display: "flex", // Alinea los elementos en fila
                          alignItems: "center", // Centra verticalmente los botones
                          gap: 1, // Espaciado entre botones
                        }}
                      >
                        {tracking && tracking.message && statesComment.includes(tracking.state) && (
                          <CommentButton onClick={() => handleOpenCommentDialog(tracking.message)} />
                        )}
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          onClick={() => handleEvalClick(credit.id)}
                          startIcon={<EditIcon />}
                          disabled={tracking ? !evaluationStates.includes(tracking.state) : true}
                        >
                          Evaluar
                        </Button>
                      </Box>
                    </TableCell>

                    
                </TableRow>
                );
            })}
            </TableBody>
        </Table>
        </TableContainer>

        <Dialog open={openCommentDialog} onClose={handleCloseCommentDialog}>
          <DialogTitle>Comentarios</DialogTitle>
          <DialogContent>
            <Typography>{currentComments || "No hay comentarios disponibles."}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCommentDialog} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

    </>
    ) : (
    <p>No posee créditos</p>
    )}
</div>
  );
};

export default CreditTableExec;
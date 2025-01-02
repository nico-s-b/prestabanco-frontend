import { Button, Dialog, DialogContent, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import LoanRequirementsTable from './CreditRequeriments';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const RequerimentsDialog = () => {

      const [openLoanRequirements, setOpenLoanRequirements] = useState(false);
    
      const handleLoanRequirementsClick = () => {
        setOpenLoanRequirements(true);
      }
    
      const handleCloseDialog = () => {
        setOpenLoanRequirements(false);
      };

    return (

    <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ marginTop: 4 }}>
    {/* Botón para abrir el cuadro de diálogo */}
    <Button
        variant="outlined" 
        color="default"
        startIcon={<InfoOutlinedIcon />} 
        onClick={handleLoanRequirementsClick}
        sx={{
            color: "text.primary", // Opcional: texto en un color neutro
            borderColor: "rgba(255, 255, 255, 0.4)", // Opcional: borde gris claro
            "&:hover": {
            borderColor: "rgba(0, 0, 0, 0.5)", // Borde un poco más oscuro al hover
            backgroundColor: "rgba(0, 0, 0, 0.04)", // Fondo gris claro al hover
            },
        }}
        >
        Ver condiciones de créditos
        </Button>
  
    {/* Pie de página */}
    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
      PrestaBanco © 2025
    </Typography>
  
    {/* Cuadro de diálogo */}
    <Dialog
      open={openLoanRequirements}
      onClose={handleCloseDialog}
      fullWidth
      maxWidth="md"
    >
      <DialogContent>
        <LoanRequirementsTable />
      </DialogContent>
    </Dialog>
  </Grid>
);
}

  export default RequerimentsDialog;  
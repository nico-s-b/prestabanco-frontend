import React, { useState } from "react";
import { Grid, Box, Typography } from "@mui/material";

import calculationService from "../services/calculation.service";

const EvalRule7 = ({ creditInfo, clientInfo, evaluationData, documents, handleEvaluationChange, handleDownloadDocument , handleClientInfoChange}) => {
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      {/* Subtítulo */}
      <Typography variant="h6" align="center" sx={{ marginBottom: 2 }}>
        Evaluando regla 7
      </Typography>

      {/* Grilla */}
      <Grid container spacing={2}>
        {/* Fila 1 */}
        <Grid item xs={6}>
          <Box sx={{ border: "1px solid #ccc", height: "100px" }}></Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ border: "1px solid #ccc", height: "100px" }}></Box>
        </Grid>

        {/* Fila 2 */}
        <Grid item xs={6}>
          <Box sx={{ border: "1px solid #ccc", height: "100px" }}></Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ border: "1px solid #ccc", height: "100px" }}></Box>
        </Grid>

        {/* Fila 3 */}
        <Grid item xs={6}>
          <Box sx={{ border: "1px solid #ccc", height: "100px" }}></Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ border: "1px solid #ccc", height: "100px" }}></Box>
        </Grid>

      </Grid>
    </Box>
  );
};
export default EvalRule7;
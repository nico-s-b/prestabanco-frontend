import React, { useEffect, useState } from "react";
import { Grid, TextField, MenuItem, Slider, Typography } from "@mui/material";
import { fetchRestrictions } from "./CreditUtils";

const CreditForm = ({   
  creditType, setCreditType, loanPeriod, setLoanPeriod, creditMount,
  setCreditMount, propertyValue, setPropertyValue, annualRate, setAnnualRate,
  restrictions, setRestrictions, isValuesEntered, setIsValuesEntered, error, 
 setIsPeriodMountEntered, initialValues = {} , isRequest, setIsRequest, isLoggedIn
}) => {
  
  useEffect(() => {
    if (isValuesEntered) {
      const getRestrictions = async () => {
        try {
          const restrictionsData = await fetchRestrictions(creditType, propertyValue);
          setRestrictions(restrictionsData); 
        } catch (error) {
          console.error("Error al obtener restricciones:", error);
        }
      };
      getRestrictions();
    }
  }, [isValuesEntered, creditType, propertyValue, setRestrictions]);

  const [isSlideInitialized, setIsSlideInitialized] = useState(false);

  useEffect(() => {
    if (!isSlideInitialized) {
      if (initialValues && initialValues.annualRate !== undefined) {
        setAnnualRate(parseFloat(initialValues.annualRate));
        setIsSlideInitialized(true); 
      } else if (restrictions && restrictions.minAnnualRate > 0) {
        setAnnualRate((restrictions.minAnnualRate + restrictions.maxAnnualRate) / 2);
        setIsSlideInitialized(true); 
      }
    }
  }, [restrictions, initialValues, isSlideInitialized]);

  useEffect(() => {
    if (initialValues) {
      const {
        creditType: initCreditType,
        loanPeriod: initLoanPeriod,
        creditMount: initCreditMount,
        propertyValue: initPropertyValue,
        annualRate: initAnnualRate,
      } = initialValues;
  
      if (initCreditType) {
        setCreditType((prev) => prev || initCreditType);
      }
      if (initPropertyValue) {
        setPropertyValue((prev) => prev || initPropertyValue);
        setIsValuesEntered(true);
      }
      if (initLoanPeriod) {
        setLoanPeriod((prev) => prev || initLoanPeriod);
      }
      if (initCreditMount) {
        setCreditMount((prev) => prev || initCreditMount);
        setIsPeriodMountEntered(true);
      }
      if (initAnnualRate) {
        setAnnualRate((prev) => prev || initAnnualRate);
      }
    }
  }, [initialValues]);
  

  const handleTypePropertyChange = () => {
    if (creditType && propertyValue) {
      setIsValuesEntered(true);
    }
  };

  const handleSlideChange = (e, setValue) => {
    const value = parseFloat(e.target.value);
    setValue(value);
  };

  const handleChange = (e, setter, max = null) => {
    if (loanPeriod && creditMount) {
      setIsPeriodMountEntered(true);
    }
    const { value } = e.target;
    const unformattedValue = unformatNumber(value);
    
    if (/^\d*$/.test(unformattedValue)) {
      const numericValue = parseInt(unformattedValue, 10);
      
      if (max && numericValue > max) {
        alert(`El valor no puede ser mayor al máximo permitido (${max.toLocaleString("es-CL")})`);
        setter(max.toString());
      } else {
        setter(unformattedValue);
      }
    }
  };

  const formatNumber = (value) => {
    return value ? parseInt(value, 10).toLocaleString("es-CL") : "";
  };

  const unformatNumber = (value) => {
    return value.replace(/\D/g, '');
  };

  return (
    <Grid container spacing={1}>
      {/* Tipo de Crédito */}
      <Grid item xs={12} md={6}>
        <TextField
          select
          fullWidth
          label="Tipo de Crédito"
          value={creditType}
          onChange={(e) => {
            setCreditType(e.target.value);
            handleTypePropertyChange();
          }}
          required
          disabled={isRequest && !isLoggedIn}
        >
          <MenuItem value="">Seleccionar</MenuItem>
          <MenuItem value="FIRSTHOME">Primera Vivienda</MenuItem>
          <MenuItem value="SECONDHOME">Segunda Vivienda</MenuItem>
          <MenuItem value="COMERCIAL">Comercial</MenuItem>
          <MenuItem value="REMODELING">Remodelación</MenuItem>
        </TextField>
      </Grid>

      {/* Valor de la Propiedad */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Valor de la Propiedad"
          value={formatNumber(propertyValue)}
          onChange={(e) => {
            handleChange(e, setPropertyValue);
            handleTypePropertyChange();
          }}
          required
          disabled={isRequest && !isLoggedIn}
        />
      </Grid>

      {/* Período del Préstamo */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="Período del Préstamo (años)"
          value={loanPeriod}
          onChange={(e) => handleChange(e, setLoanPeriod, restrictions.maxLoanPeriod)}
          inputProps={{
            min: 1,
            max: restrictions.maxLoanPeriod,
          }}
          required
          disabled={!isValuesEntered} 
        />
        <Typography variant="caption">
          Máximo: {restrictions.maxLoanPeriod} años
        </Typography>
      </Grid>

      {/* Monto del Crédito */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Monto del Crédito"
          value={formatNumber(creditMount)}
          onChange={(e) => handleChange(e, setCreditMount, restrictions.maxFinancingMount)}
          required
          disabled={!isValuesEntered} 
        />
        <Typography variant="caption">
          Máximo: {restrictions.maxFinancingMount?.toLocaleString("es-CL")}
        </Typography>
      </Grid>

      {/* Tasa de Interés */}
      <Grid item xs={12}>
        <Typography gutterBottom>
          Tasa de Interés Anual: {annualRate ? parseFloat(annualRate).toFixed(1) : "0"}%
        </Typography>
        <Slider
          value={typeof annualRate === "number" ? annualRate : 0} 
          onChange={(e) => handleSlideChange(e, setAnnualRate)}
          min={typeof restrictions.minAnnualRate === "number" ? restrictions.minAnnualRate : 0}
          max={typeof restrictions.maxAnnualRate === "number" ? restrictions.maxAnnualRate : 10}
          step={0.1}
          marks={[
            {
              value: typeof restrictions.minAnnualRate === "number" ? restrictions.minAnnualRate : 0,
              label: restrictions.minAnnualRate !== 0 ? `${restrictions.minAnnualRate}%` : "",
            },
            {
              value: typeof restrictions.maxAnnualRate === "number" ? restrictions.maxAnnualRate : 10,
              label: restrictions.maxAnnualRate !== 0 ? `${restrictions.maxAnnualRate}%` : "",
            },
          ]}
          disabled={!isValuesEntered} 
          sx={{
            "& .MuiSlider-markLabel": {
              transform: "translateX(-50%)",
            },
            "& .MuiSlider-markLabel[data-index='0']": { // etiqueta izquierda
              transform: "translateX(-1%)",
            },
            "& .MuiSlider-markLabel[data-index='1']": { // etiqueta derecha
              transform: "translateX(-75%)", 
            },
          }}
        />

      </Grid>

      {!isValuesEntered && isLoggedIn && (
        <Grid item xs={12}>
          <Typography color="textSecondary">
            Ingrese el tipo de crédito y el valor de la propiedad para continuar.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default CreditForm;

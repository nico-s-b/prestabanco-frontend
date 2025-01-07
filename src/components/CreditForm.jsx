import React, { useEffect, useState } from "react";
import { Grid, TextField, MenuItem, Slider, Typography, Tooltip } from "@mui/material";
import { fetchRestrictions , getCreditType } from "./CreditUtils";

const CreditForm = ({   
  creditType, setCreditType, loanPeriod, setLoanPeriod, creditMount,
  setCreditMount, propertyValue, setPropertyValue, annualRate, setAnnualRate,
  restrictions, setRestrictions, isValuesEntered, setIsValuesEntered, 
 setIsPeriodMountEntered, initialValues = {} , isRequest, setIsRequest, isLoggedIn
}) => {
  const [activeField, setActiveField] = useState(null);
  const [errorProp, setErrorProp] = useState("");
  const [errorPeriod, setErrorPeriod] = useState("");
  const [errorMount, setErrorMount] = useState("");

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

  const [allValuesEntered, setAllValuesEntered] = useState(false);
  const handleValuesEntered = () => {
    if (loanPeriod && creditMount && creditType && propertyValue && annualRate) {
      setAllValuesEntered(true);
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
        //alert(`El valor no puede ser mayor al máximo permitido (${max.toLocaleString("es-CL")})`);
        //setter(max.toString());
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
    <Grid container spacing={2}>
      {/* Tipo de Crédito */}
      <Grid item xs={12} md={6}>
        <TextField
          onFocus={() => setActiveField("creditType")}
          onBlur={() => setActiveField(null)}        
          select
          fullWidth
          label="Tipo de Crédito"
          value={creditType}
          onChange={(e) => {
            setCreditType(e.target.value);
            handleTypePropertyChange();
            handleValuesEntered();
          }}
          required
          sx={{
            "& .MuiOutlinedInput-root": {
              fieldset: {
                borderColor: !creditType ? "#1976d2" : "primary", // Azul si no se ha ingresado, gris por defecto si ya tiene valor
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1976d2", // Azul cuando está enfocado
              },
            },
          }}          
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
          onFocus={() => setActiveField("propertyValue")}
          onBlur={() => setActiveField(null)}              
          fullWidth
          label="Valor de la Propiedad"
          value={formatNumber(propertyValue)}
          onChange={(e) => {
            const maxPropertyValue = 2147483647;
            const rawValue = e.target.value.replace(/\D/g, "");
            const numericValue = parseInt(rawValue, 10);
        
            if (!isNaN(numericValue) && numericValue <= maxPropertyValue) {
              setErrorProp(""); // Limpia el mensaje de error si el valor es válido
              handleChange(e, setPropertyValue);
              handleTypePropertyChange();
              handleValuesEntered();
            } else if (numericValue > maxPropertyValue) {
              setErrorProp(`El valor máximo permitido es ${maxPropertyValue.toLocaleString("es-CL")}`);
            }
          }}
          required
      
          sx={{
            "& .MuiOutlinedInput-root": {
              fieldset: {
                borderColor: !propertyValue && creditType ? "#1976d2" : "primary", // Azul si el tipo está definido pero no el valor; gris por defecto en otros casos
              },
              "&.Mui-focused fieldset": {
                borderColor: !propertyValue ? "#1976d2" : "primary", // Azul cuando está enfocado
              },
            },
          }}
          error={!!errorProp}
          helperText={errorProp}
          disabled={isRequest && !isLoggedIn}
        />
      </Grid>

      {/* Período del Préstamo */}
      <Grid item xs={12} md={6}>
        <TextField
          onFocus={() => setActiveField("loanPeriod")}
          onBlur={() => setActiveField(null)}              
          fullWidth
          type="number"
          label="Período del Préstamo (años)"
          value={loanPeriod}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value) && value <= restrictions.maxLoanPeriod) {
              setLoanPeriod(value);
              setErrorPeriod(""); // Limpia el error si el valor es válido
            } else {
              setErrorPeriod(`El valor no puede ser mayor a ${restrictions.maxLoanPeriod}`);
            }
          }}
          inputProps={{
            min: 1,
            max: restrictions.maxLoanPeriod,
          }}
          required
          error={Boolean(errorPeriod)}
          helperText={errorPeriod || ""}
          disabled={!isValuesEntered}
          sx={{
            "& .MuiOutlinedInput-root": {
              fieldset: {
                borderColor: isValuesEntered && !loanPeriod ? "#1976d2" : "primary", // Azul si el tipo está definido pero no el valor; gris por defecto en otros casos
              },
              "&.Mui-focused fieldset": {
                borderColor: !loanPeriod ? "#1976d2" : "primary", // Azul cuando está enfocado
              },
            },
          }}
        />
        <Tooltip 
          title={
            `Cantidad máxima de años para un crédito de tipo "${getCreditType(creditType) || 'Seleccionar tipo de crédito'}". 
            Presione "VER CONDICIONES" para más información.`
          } 
          arrow
          placement="bottom"
        >
          <Typography variant="caption" sx={{ cursor: "help" }}>
            <span style={{ color: "#FFC107", fontWeight: "bold" }}>Máximo:</span> {restrictions.maxLoanPeriod?.toLocaleString("es-CL")} años
          </Typography>
        </Tooltip>

      </Grid>

      {/* Monto del Crédito */}
      <Grid item xs={12} md={6}>
        <TextField
          onFocus={() => setActiveField("creditMount")}
          onBlur={() => setActiveField(null)}              
          fullWidth
          label="Monto del Crédito"
          value={formatNumber(creditMount)}

          onChange={(e) => {
            const maxFinancingMount = restrictions.maxFinancingMount;
            const rawValue = e.target.value.replace(/\D/g, "");
            const numericValue = parseInt(rawValue, 10);
        
            if (!isNaN(numericValue) && numericValue <= maxFinancingMount) {
              setErrorMount(""); // Limpia el mensaje de error si el valor es válido
              handleChange(e, setCreditMount, restrictions.maxFinancingMount);
              handleValuesEntered();
            } else if (numericValue > maxFinancingMount) {
              setErrorMount(`El valor máximo permitido es ${maxFinancingMount.toLocaleString("es-CL")}`);
            }
          }}

          required
          error={Boolean(errorMount)}
          helperText={errorMount || ""}
          sx={{
            "& .MuiOutlinedInput-root": {
              fieldset: {
                borderColor: isValuesEntered && !creditMount ? "#1976d2" : "primary", // Azul si el tipo está definido pero no el valor; gris por defecto en otros casos
              },
              "&.Mui-focused fieldset": {
                borderColor: !creditMount ? "#1976d2" : "primary", // Azul cuando está enfocado
              },
            },
          }}              
          disabled={!isValuesEntered} 
        />
        <Tooltip 
          title={
            `Corresponde a un %${creditType==="FIRSTHOME" && "80"
              || creditType==="SECONDHOME" && "70"
              || creditType==="COMERCIAL" && "60"
              || creditType==="REMODELING" && "50"
            } del valor de la propiedad para un crédito de tipo "${getCreditType(creditType) || 'Seleccionar tipo de crédito'}". 
            Presione "VER CONDICIONES" para más información.`
          } 
          arrow
          placement="bottom"
        >       
          <Typography variant="caption">
            <span style={{ color: "#FFC107", fontWeight: "bold" }}>Máximo:</span> $ {restrictions.maxFinancingMount?.toLocaleString("es-CL")}
          </Typography>
        </Tooltip>
      </Grid>

      {/* Tasa de Interés */}
      <Grid item xs={12}>
        <Typography gutterBottom>
          Tasa de Interés Anual: {annualRate ? parseFloat(annualRate).toFixed(1) : "0"}%
        </Typography>
        <Slider
          onFocus={() => setActiveField("annualRate")}
          onBlur={() => setActiveField(null)}              
          value={typeof annualRate === "number" ? annualRate : 0} 
          onChange={(e) => { handleSlideChange(e, setAnnualRate); handleValuesEntered(); }}
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

      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <Typography
          variant="body2"
          sx={{
            fontStyle: "italic",
            color: "text.secondary",
          }}
        >
          {activeField === "creditType" && "¿Qué tipo de crédito deseas escoger?"}
          {activeField === "propertyValue" && "¿Cuál es el valor de la propiedad?"}
          {activeField === "loanPeriod" && "¿A cuántos años pedirás el crédito?"}
          {activeField === "creditMount" && "¿Cuál es el monto que quieres solicitar?"}
          {activeField === "annualRate" && "¿Qué interés vas a solicitar?"}
          {activeField === null && !creditType && !propertyValue && "Ingrese el tipo de crédito y el valor de la propiedad para continuar."}
          {activeField === null && creditType && !propertyValue && "Ingresa el valor de la propiedad para continuar."}
          {activeField === null && isValuesEntered && !allValuesEntered && "Completa los campos restantes para continuar."}
          {activeField === null && allValuesEntered && !isRequest && "Todos los campos están completos. Haz click en el botón para simular"}
          {activeField === null && allValuesEntered && isRequest && "Todos los campos están completos. Haz click en el botón para solicitar"}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CreditForm;

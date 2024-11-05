import React, { useEffect, useState } from "react";
import { fetchRestrictions } from "./CreditUtils";

const CreditForm = ({   
  creditType, setCreditType, loanPeriod, setLoanPeriod, creditMount,
  setCreditMount, propertyValue, setPropertyValue, annualRate, setAnnualRate,
  restrictions, setRestrictions, isValuesEntered, setIsValuesEntered, error
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

  const handleValueChange = () => {
    if (creditType && propertyValue) {
      setIsValuesEntered(true);
    }
    if (loanPeriod > restrictions.maxLoanPeriod) {
      alert("El periodo de préstamo no puede ser mayor al máximo permitido");
      setLoanPeriod(restrictions.maxLoanPeriod);
    }
    if (creditMount > restrictions.maxFinancingMount) {
      alert("El monto del crédito no puede ser mayor al máximo permitido");
      setCreditMount(restrictions.maxFinancingMount);
    }
  };

  const handleChange = (e, setter) => {
    const { value } = e.target;
    const rawValue = value.replace(/\./g, ""); // Remueve puntos
    setter(rawValue);    
  };

  const handleSlideChange = (e, setValue) => {
    const value = parseFloat(e.target.value);
    setValue(value);
  };

  const formatNumber = (value) => {
    return value ? parseInt(value, 10).toLocaleString("es-CL") : "";
  };

  return (
    <div>
      <label>
        Tipo de Crédito:
        <select 
          value={creditType} 
          onChange={(e) => { setCreditType(e.target.value); handleValueChange(); }} 
          required
        >
          <option value="">Seleccionar</option>
          <option value="FIRSTHOME">Primera Vivienda</option>
          <option value="SECONDHOME">Segunda Vivienda</option>
          <option value="COMERCIAL">Comercial (Chile)</option>
          <option value="REMODELING">Remodelación</option>
        </select>
      </label>
      <br />
      <label>
        Valor de la Propiedad:
        <input
          type="text"
          value={formatNumber(propertyValue)}
          onChange={(e) => { handleChange(e, setPropertyValue); handleValueChange(); }}
          required
          min="1"
        />
      </label>
      <br />

      {isValuesEntered ? (
        <>
          <label>
            Período del Préstamo (años):
            <input
              type="number"
              value={loanPeriod}
              onChange={(e) => { setLoanPeriod(e.target.value); handleValueChange(); }}
              max={restrictions.maxLoanPeriod}
              required
              min="1"
            />
          </label>
          Valor máximo: {restrictions.maxLoanPeriod}
          <br />
          <label>
            Monto del Crédito:
            <input
              type="text"
              value={formatNumber(creditMount)}
              onChange={(e) => { handleChange(e, setCreditMount); handleValueChange(); }}
              max={restrictions.maxFinancingMount}
              required
              min="1"
            />
          </label>
          Valor máximo: {restrictions.maxFinancingMount.toLocaleString("es-CL")}
          <br />
          <label>
            Interés: {restrictions.minAnnualRate}% -
            <input
              type="range"
              value={annualRate}
              onChange={(e) => handleSlideChange(e, setAnnualRate)}
              required
              min={restrictions.minAnnualRate}
              max={restrictions.maxAnnualRate}
              step="0.1"
            />
            - {restrictions.maxAnnualRate}% , elegido: {annualRate}%
          </label>
        </>
      ) : (
        <label>
          Ingrese el tipo de crédito y el valor de la propiedad para continuar con la solicitud de crédito.
        </label>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreditForm;

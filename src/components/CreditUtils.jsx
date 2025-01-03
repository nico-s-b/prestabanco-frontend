import calculationService from "../services/calculation.service";

export const fetchRestrictions = async (creditType, propertyValue) => {
  try {
    const response = await calculationService.restrictions({ creditType, propertyValue });
    return {
      ...response.data,
      minAnnualRate: parseFloat(response.data.minAnnualRate),
      maxAnnualRate: parseFloat(response.data.maxAnnualRate),
    };
  } catch (error) {
    console.error("Error al obtener restricciones:", error);
    throw error;
  }
};

export const getRequiredDocumentsCount = (creditType) => {
    if (creditType === "FIRSTHOME" || creditType === "REMODELING") {
      return 3;
    } else if (creditType === "SECONDHOME" || creditType === "COMERCIAL") {
      return 4;
    }
    return 0; 
  };

export const documentTypeMap = {
  "Comprobante de ingresos": "INCOMECERTIFY",
  "Certificado de avalúo": "VALUATIONCERTIFY",
  "Historial crediticio": "CREDITREPORT",
  "Escritura de primera vivienda": "FIRSTHOUSEDEED",
  "Estado financiero del negocio": "FINANCIALSTATUSREPORT",
  "Plan de negocios": "BUSINESSPLAN",
  "Presupuesto de remodelación": "REMODELINGBUDGET",
  "Certificado de avalúo actualizado": "UPDATEDVALUATIONCERTIFY",
};

export const DocumentType = {
  INCOMECERTIFY: "INCOMECERTIFY",
  VALUATIONCERTIFY: "VALUATIONCERTIFY",
  CREDITREPORT: "CREDITREPORT",
  FIRSTHOUSEDEED: "FIRSTHOUSEDEED",
  FINANCIALSTATUSREPORT: "FINANCIALSTATUSREPORT",
  BUSINESSPLAN: "BUSINESSPLAN",
  REMODELINGBUDGET: "REMODELINGBUDGET",
  UPDATEDVALUATIONCERTIFY: "UPDATEDVALUATIONCERTIFY",
};

export const documentDescriptions = {
  "Comprobante de ingresos": "Documento que certifica tus ingresos de los últimos 2 años. Puede incluir recibos de sueldo, declaraciones de impuestos o balances financieros.",
  "Certificado de avalúo": "Informe emitido por un tasador autorizado que detalla el valor actual de la propiedad.",
  "Historial crediticio": "Registro de tus deudas, pagos y calificación crediticia. Incluye información de DICOM u otras entidades financieras.",
  "Escritura de primera vivienda": "Documento legal que certifica la propiedad de la vivienda en cuestión.",
  "Estado financiero del negocio": "Resumen detallado de los ingresos, gastos y balances financieros de tu empresa.",
  "Plan de negocios": "Documento que describe la estructura, objetivos y estrategias financieras de tu negocio.",
  "Presupuesto de remodelación": "Plan detallado de costos estimados para los trabajos de remodelación que deseas realizar.",
  "Certificado de avalúo actualizado": "Informe reciente emitido por un tasador autorizado que detalla el valor actual y actualizado de la propiedad."
};

export const renderNeededDocuments = (creditType) => {
  let documents = [];

  if (creditType === "FIRSTHOME") {
    documents = [
      DocumentType.INCOMECERTIFY,
      DocumentType.VALUATIONCERTIFY,
      DocumentType.CREDITREPORT,
    ];
  } else if (creditType === "SECONDHOME") {
    documents = [
      DocumentType.INCOMECERTIFY,
      DocumentType.VALUATIONCERTIFY,
      DocumentType.FIRSTHOUSEDEED,
      DocumentType.CREDITREPORT,
    ];
  } else if (creditType === "COMERCIAL") {
    documents = [
      DocumentType.FINANCIALSTATUSREPORT,
      DocumentType.INCOMECERTIFY,
      DocumentType.VALUATIONCERTIFY,
      DocumentType.BUSINESSPLAN,
    ];
  } else if (creditType === "REMODELING") {
    documents = [
      DocumentType.INCOMECERTIFY,
      DocumentType.REMODELINGBUDGET,
      DocumentType.UPDATEDVALUATIONCERTIFY,
    ];
  }

  return documents;
};
  
export const textNeededDocuments = (creditType) => {
  let documents = [];

  if (creditType === "FIRSTHOME") {
    documents = [
      "Comprobante de ingresos",
      "Certificado de avalúo",
      "Historial crediticio"
    ];
  } else if (creditType === "SECONDHOME") {
    documents = [
      "Comprobante de ingresos",
      "Certificado de avalúo",
      "Escritura de primera vivienda",
      "Historial crediticio"
    ];
  } else if (creditType === "COMERCIAL") {
    documents = [
      "Estado financiero del negocio",
      "Comprobante de ingresos",
      "Certificado de avalúo",
      "Plan de negocios"
    ];
  } else if (creditType === "REMODELING") {
    documents = [
      "Comprobante de ingresos",
      "Presupuesto de remodelación",
      "Certificado de avalúo actualizado"
    ];

  }

  return documents;
};


export const getCreditState = (state) => {
    if (state === "INITIALREV") {
      return "Revisión incial";
    } else if (state === "PENDINGDOCUMENTATION") {
      return "Documentación pendiente";
    } else if (state === "EVALUATING") {
      return "En evaluación";
    } else if (state === "PREAPROVAL") {
      return "Pre-aprobado";
    } else if (state === "FINALAPROVAL") {
      return "En aprobación final";
    } else if (state === "APROVED") {
      return "Aprobada";
    } else if (state === "REJECTED") {
      return "Rechazada";
    } else if (state === "CANCELLED") {
      return "Cancelada";
    } else if (state === "INOUTLAY") {
      return "En desembolso";
    }
    return "";
  };

  export const getCreditType = (type) => {
    if (type === "FIRSTHOME") {
      return "Primera casa";
    } else if (type === "SECONDHOME") {
      return "Segunda casa";
    } else if (type === "COMERCIAL") {
      return "Comercial";
    } else if (type === "REMODELING") {
      return "Remodelación";
    }
      return "";
  };

  export const validateValues = (creditType, loanPeriod, creditMount, propertyValue, annualRate, restrictions, setError) => {
    if (creditType && loanPeriod && creditMount && propertyValue && annualRate) {
      if (creditMount > restrictions.maxFinancingMount) {
        setError("El monto solicitado supera el valor máximo permitido.");
        return false;
      }
      if (loanPeriod > restrictions.maxLoanPeriod) {
        setError("El plazo solicitado supera el valor máximo permitido.");
        return false;
      }
      if (annualRate < restrictions.minAnnualRate || annualRate > restrictions.maxAnnualRate) {
        setError("La tasa de interés solicitada no está dentro del rango permitido.");
        return false;
      }
      return true;
    } else {
      setError("Debes completar todos los campos para simular un crédito.");
      return false;
    }
  };
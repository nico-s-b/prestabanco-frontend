import React from "react";
import creditService from "../services/credit.service";

export const fetchRestrictions = async (creditType, propertyValue) => {
  try {
    const response = await creditService.restrictions({ creditType, propertyValue });
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
      return "Calncelada";
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
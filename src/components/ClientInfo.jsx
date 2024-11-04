import React, { useState, useEffect } from 'react';
import clientInfoService from '../services/clientinfo.services'; 
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { formatISO, format, parseISO  } from "date-fns";
import creditService from "../services/credit.service";
import CreditTable from "./CreditTable";
import { useNavigate } from "react-router-dom";

const ClientInfo = () => {
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState({
      accountBalance: '',
      startDate: '',
  });
  const [creditRecordData, setCreditRecordData] = useState({
    debtAmount: '',
    lastDebtDate: '',
    oldestUnpaidInstallmentDate: ''
  });
  const [employmentData, setEmploymentData] = useState({
    isWorking: false,
    isEmployee: false,
    currentWorkStartDate: '',
    monthlyIncome: '',
    lastTwoYearIncome: ''
  });
  const [credits, setCredits] = useState([]);

  const userId = localStorage.getItem("userId");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await creditService.getCreditsByClient(userId);
        setCredits(response.data);
      } catch (error) {
        console.error("Error al obtener los créditos del usuario:", error);
      }

      try {
        const accountResponse = await clientInfoService.getAccount(userId);
        const creditResponse = await clientInfoService.getRecord(userId);
        const employmentResponse = await clientInfoService.getEmployment(userId);

        //Formating dates for frontend
        if (accountResponse.data) {
          setAccountData({
            ...accountResponse.data,
            startDate: accountResponse.data.startDate
                ? format(parseISO(accountResponse.data.startDate), 'yyyy-MM-dd')
                : ''
          });
        }

        if (creditResponse.data) {
          setCreditRecordData({
            ...creditResponse.data,
            lastDebtDate: creditResponse.data.lastDebtDate
                ? format(parseISO(creditResponse.data.lastDebtDate), 'yyyy-MM-dd')
                : '',
            oldestUnpaidInstallmentDate: creditResponse.data.oldestUnpaidInstallmentDate
                ? format(parseISO(creditResponse.data.oldestUnpaidInstallmentDate), 'yyyy-MM-dd')
                : ''
          });
        }

        if (employmentResponse.data) {
            setEmploymentData({
              ...employmentResponse.data,
              currentWorkStartDate: employmentResponse.data.currentWorkStartDate
                  ? format(parseISO(employmentResponse.data.currentWorkStartDate), 'yyyy-MM-dd')
                  : ''
            });
        }
      } catch (error) {
          console.log("Error cargando datos:", error);
      } finally {
          setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData({ ...accountData, [name]: value });
  };

  const handleCreditChange = (e) => {
    const { name, value } = e.target;
    setCreditRecordData({ ...creditRecordData, [name]: value });
  };

  const handleEmploymentChange = (e) => {
    const { name, value } = e.target;
    setEmploymentData({ ...employmentData, [name]: value });
  };

  const handleEditClick = (id) => {
    navigate(`/credit/edit/${id}`);
  }

  const handleDelete = (id) => {
    navigate(`/credit/edit/${id}`);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Date formating for backend (ZonedDateTime)
    const formattedAccountData = {
      ...accountData,
      startDate: formatISO(new Date(accountData.startDate))
    };
    const formattedCreditRecordData = {
      ...creditRecordData,
      lastDebtDate: formatISO(new Date(creditRecordData.lastDebtDate)),
      oldestUnpaidInstallmentDate: formatISO(new Date(creditRecordData.oldestUnpaidInstallmentDate))
    };
    const formattedEmploymentData = {
      ...employmentData,
      currentWorkStartDate: formatISO(new Date(employmentData.currentWorkStartDate))
    };

    try {
        await clientInfoService.createOrUpdateAccount(userId, formattedAccountData);
        await clientInfoService.createOrUpdateRecord(userId, formattedCreditRecordData);
        await clientInfoService.createOrUpdateEmployment(userId, formattedEmploymentData);
        alert("Datos actualizados correctamente");
    } catch (error) {
        console.error("Error al actualizar los datos:", error);
        alert("Error al actualizar los datos");
    }
  };

  if (isLoading) {
      return <div>Cargando datos de la cuenta...</div>;
  }

  return (
      <>
      <form onSubmit={handleSubmit}>
        <h2>Cuenta de ahorro</h2>
        <div>
          <label>Saldo en cuenta de ahorro: </label>
          <input
            type="number"
            name="accountBalance"
            value={accountData.accountBalance || ''}
            onChange={handleAccountChange}
            placeholder="Ingrese el balance de la cuenta" />
        </div>
        <div>
          <label>Fecha de apertura de cuenta: </label>
          <input
            type="date"
            name="startDate"
            value={accountData.startDate || ''}
            onChange={handleAccountChange}
            placeholder="Ingrese la fecha de inicio" />
        </div>

        <h2>Historial crediticio</h2>
        <div>
          <label>Monto total de deudas: </label>
          <input
            type="number"
            name="debtAmount"
            value={creditRecordData.debtAmount || ''}
            onChange={handleCreditChange}
            placeholder="Ingrese el monto de deuda" />
        </div>
        <div>
          <label>Fecha en que contrajo última deuda:</label>
          <input
            type="date"
            name="lastDebtDate"
            value={creditRecordData.lastDebtDate || ''}
            onChange={handleCreditChange}
            placeholder="Ingrese la fecha de última deuda" />
        </div>
        <div>
          <label>Fecha de cuota más antigua impaga:</label>
          <input
            type="date"
            name="oldestUnpaidInstallmentDate"
            value={creditRecordData.oldestUnpaidInstallmentDate || ''}
            onChange={handleCreditChange}
            placeholder="Ingrese la fecha de cuota impaga más antigua" />
        </div>

        <h2>Antecedentes laborales</h2>
        <div>
          <label>¿Está trabajando actualmente?</label>
          <input
            type="checkbox"
            name="isWorking"
            checked={employmentData.isWorking || false}
            onChange={(e) => setEmploymentData({ ...employmentData, isWorking: e.target.checked })} />
        </div>
        <div>
          <label>¿Es empleado con contrato?</label>
          <input
            type="checkbox"
            name="isEmployee"
            checked={employmentData.isEmployee || false}
            onChange={(e) => setEmploymentData({ ...employmentData, isEmployee: e.target.checked })} />
        </div>
        {employmentData.isEmployee ?
          <div>
            <div>
              <label>Fecha de inicio de empleo actual: </label>
              <input
                type="date"
                name="currentWorkStartDate"
                value={employmentData.currentWorkStartDate || ''}
                onChange={handleEmploymentChange}
                placeholder="Ingrese la fecha de inicio del empleo actual" />
            </div>
            <div>
              <label>Ingreso mensual: </label>
              <input
                type="number"
                name="monthlyIncome"
                value={employmentData.monthlyIncome || ''}
                onChange={handleEmploymentChange}
                placeholder="Ingrese el ingreso mensual" />
            </div>
          </div>
          :
          <div>
            <div>
              <label>Ingresos totales de los últimos dos años: </label>
              <input
                type="number"
                name="lastTwoYearIncome"
                value={employmentData.lastTwoYearIncome || ''}
                onChange={handleEmploymentChange}
                placeholder="Ingrese el ingreso acumulado de los últimos dos años" />
            </div>
          </div>}

        <br />
        <Button
          type="submit"
          variant="contained"
          color="info"
          startIcon={<EditIcon />}
        >
          Guardar Cambios
        </Button>
      </form>

    <div>        
      <CreditTable credits={credits} handleEditClick={handleEditClick} handleDelete={handleDelete} />
    </div>

    </>
  );
};

export default ClientInfo;

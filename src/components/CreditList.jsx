import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import creditService from "../services/credit.service";
import CreditTableExec from "./CreditTableExec";
import trackingService from "../services/tracking.service";

const CreditList = () => {
  const navigate = useNavigate();
  const [credits, setCredits] = useState([]);
  const [trackings, setTrackings] = useState([]);

  useEffect(() => {
    const fetchCreditData = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try{
          const creditResponse = await creditService.getAllCredits();
          setCredits(creditResponse.data);

          const trackingsPromises = creditResponse.data.map(async (credit) => {
            try {
              const trackingResponse = await trackingService.getTracking(credit.id);
              return trackingResponse.data;
            } catch (error) {
              console.error(
                `Error al obtener el tracking del crédito ${credit.id}:`,
                error
              );
              return null;
            }
          });
  
          const allTrackings = await Promise.all(trackingsPromises); // Esperar solicitudes.
          setTrackings(allTrackings.filter(Boolean));

        } catch (error) {
          console.error("Error al obtener créditos", error);
        }
      }
    };
    fetchCreditData();
  }, []);

  const handleEvalClick = (id) => {
    navigate(`/credit/eval/${id}`);
  }

    return (
      <div>
        <h1>Créditos</h1>
        <div>
          <CreditTableExec credits={credits} trackings={trackings} handleEvalClick={handleEvalClick} />
        </div>

      </div>
    );
  };
  
  export default CreditList;
  
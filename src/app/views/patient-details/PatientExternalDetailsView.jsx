import { useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import * as PatientApi from 'api/patient-api';
import { showAlert } from "@/app/helpers/utility-functions";


const PatientExternalDetailsView = () => {
   const history = useHistory();
   const { pathname } = useLocation();
   const { externalIdentifier } = useParams();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await PatientApi.getPatientByExternalId(externalIdentifier);
        const patientIdentifier = response.patientIdentifier;
          history.push({
            pathname: `/core/patient/${patientIdentifier}`,
            state: {
              from: pathname,
            },
          });
      } catch (error) {
        showAlert({
          status: 'warning',
          title: 'Not found',
          text:
            `We are sorry, no patient found with ${externalIdentifier} Id.` ??
            'Could not complete your request, please try again later',
          showConfirmButton: true,
          confirmButtonText: 'Go to Home',
          allowOutsideClick: true,
          allowEscapeKey: true,
          confirmationCallback: () => {
            window.location.href = '/#/core/home';
            window.location.reload();
          },
        });
      }
    };

    fetchPatient();
  }, [externalIdentifier, history, pathname]);
};
export default PatientExternalDetailsView;
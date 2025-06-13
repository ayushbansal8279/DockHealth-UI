import React, { useCallback, useEffect, useState } from "react";

import { WorkspacePatientsContainer, WorkspacePatientsHeader, WorkspacePatientsTableWrapper } from "./styled";
import PatientsList from "@/app/components/patients/PatientsList/PatientsList";
import { getPatientListIdentifierByUrlParameter } from "@/app/helpers/patient-list-helpers";
import { useDispatch, useSelector } from "react-redux";
import * as PatientsActions from 'actions/patients-actions';
import { useParams } from "react-router-dom";
import PatientsToolbar from "@/app/components/patients/PatientsToolbar/PatientsToolbar";
import { patientsSelector } from "@/app/selectors/patients-selectors";

const WorkspacePatients = () => {
  const dispatch = useDispatch();
  
  const [searchValue, setSearchValue] = useState(null);
  const [importPopoverOpen, setImportPopoverOpen] = useState(false);

  // const { listIdentifier: listIdentifierParameter } = useParams();
  const patients = useSelector(patientsSelector);

  // TODO: get workspace patient list identifier
  const listIdentifierParameter = 'cd2d38ae-d4fd-497b-907e-fa97708a28f5';
  const patientListIdentifier = getPatientListIdentifierByUrlParameter(listIdentifierParameter);

  useEffect(() => {
    dispatch(PatientsActions.initializePatientsListState(patientListIdentifier));
  }, [dispatch, patientListIdentifier]);

  const refreshPatients = useCallback(() => {
    dispatch(PatientsActions.getCurrentPatients());
  }, [dispatch]);

  return (
    <WorkspacePatientsContainer>
      <PatientsToolbar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setImportPopoverOpen={setImportPopoverOpen}
        showAddButton
      />
      <WorkspacePatientsTableWrapper>
        <PatientsList
          patients={patients}
          importPopoverOpen={importPopoverOpen}
          setImportPopoverOpen={setImportPopoverOpen}
          searchValue={searchValue}
          refreshPatients={refreshPatients}
        />
      </WorkspacePatientsTableWrapper>
    </WorkspacePatientsContainer>
  );
};

export default WorkspacePatients;

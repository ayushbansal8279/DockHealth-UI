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

  const { workspaceIdentifier, listIdentifier: listIdentifierParameter } = useParams();

  const patients = useSelector(patientsSelector);

  const patientListIdentifier = getPatientListIdentifierByUrlParameter(listIdentifierParameter);

  useEffect(() => {
    dispatch(PatientsActions.initializePatientsListState(patientListIdentifier));
  }, [dispatch, patientListIdentifier]);

  const refreshPatients = useCallback(() => {
    dispatch(PatientsActions.getCurrentPatients(workspaceIdentifier));
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

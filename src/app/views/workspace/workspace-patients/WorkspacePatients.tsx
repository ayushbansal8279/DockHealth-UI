import React, { useCallback, useEffect, useState } from "react";

import { WorkspacePatientsContainer, WorkspacePatientsHeader, WorkspacePatientsTableWrapper } from "./styled";
import PatientsList from "@/app/components/patients/PatientsList/PatientsList";
import { getPatientListIdentifierByUrlParameter } from "@/app/helpers/patient-list-helpers";
import { useDispatch, useSelector } from "react-redux";
import * as PatientsActions from 'actions/patients-actions';
import { useParams } from "react-router-dom";
import PatientsToolbar from "@/app/components/patients/PatientsToolbar/PatientsToolbar";
import { patientsListDetailsSelector, patientsSelector } from "@/app/selectors/patients-selectors";
import AddButton, { AddEntitiesContainer } from "@/app/components/common/AddButton/AddButton";
import Spacing from "@/app/components/common/Spacing";
import { openModal } from "@/app/modal/actions";

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
  }, [dispatch, workspaceIdentifier]);

  const listDetails = useSelector(patientsListDetailsSelector);

  const onEditPatientList = useCallback(() => {
    dispatch(
      openModal('AddPatientToList', {
        patientsList: listDetails,
        workspaceIdentifier
      }),
    );
  }, [dispatch, listDetails]);

  return (
    <WorkspacePatientsContainer>
      <PatientsToolbar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setImportPopoverOpen={setImportPopoverOpen}
        workspaceIdentifier={workspaceIdentifier}
      />
      {patientListIdentifier && patientListIdentifier.length === 36 && (
        <AddEntitiesContainer>
          <AddButton onClick={onEditPatientList}>
            Manage Patient List
          </AddButton>
          <Spacing horizontal={5} />
        </AddEntitiesContainer>
      )}
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

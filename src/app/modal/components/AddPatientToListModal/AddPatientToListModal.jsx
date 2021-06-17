import React, { useCallback, useEffect, useState } from 'react';
import { pluck } from 'ramda';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { updatePatientsList, getPatientsList } from 'api/patients-api';
import { useDispatch } from 'react-redux';
import { openModal } from 'modal/actions';
import { Grid } from '@material-ui/core';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import PatientList from 'components/patients/PatientDropdown/PatientList';
import { CloseIconButton, CloseIcon } from '../styled';
import {
  AddPatientModalWrapper,
  MainContentWrapper,
  Header,
  ListInfo,
  ListName,
  ListDescription,
  PatientsSection,
  Column,
  SelectedPatientsWrapper,
  SelectedPatientRow,
  SelectedPatientCell,
  EmptyListText,
  DeleteIcon,
} from './styled';

// eslint-disable-next-line sonarjs/cognitive-complexity
const AddPatientToListModal = ({
  closeModal,
  patientsList,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [fetchingPatients, setFetchingPatients] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [saving, setSaving] = useState(false);
  const [edited, setEdited] = useState(false);
  const dispatch = useDispatch();

  const { patientListIdentifier, listName, listDescription } =
    patientsList || {};

  useEffect(() => {
    setFetchingPatients(true);
    getPatientsList(patientListIdentifier)
      .then(fetchedList => {
        setSelectedPatients(fetchedList.patients);
        setFetchingPatients(false);
      })
      .catch(() => {
        dispatch(showGlobalErrorAlert());
        closeModal();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientListIdentifier]);

  const handleEditList = () => {
    dispatch(openModal('EditPatientList', { patientsList }));
  };

  const handleSelectPatient = useCallback(
    patient => {
      setSelectedPatients(previousSelection => {
        if (
          previousSelection.some(
            ({ patientIdentifier }) =>
              patient.patientIdentifier === patientIdentifier,
          )
        ) {
          return previousSelection;
        }
        return [...previousSelection, patient];
      });

      if (!edited) setEdited(true);
    },
    [edited],
  );

  const deleteSelectedPatient = patientIdentifierToDelete => {
    setSelectedPatients(previousSelection =>
      previousSelection.filter(
        ({ patientIdentifier }) =>
          patientIdentifier !== patientIdentifierToDelete,
      ),
    );

    if (!edited) setEdited(true);
  };

  const handleSavePatients = () => {
    setSaving(true);
    updatePatientsList(patientListIdentifier, {
      patientIdentifiers: pluck('patientIdentifier', selectedPatients),
    })
      .then(updatedList => {
        if (updatedList.patients) {
          setSelectedPatients(updatedList.patients);
        }
        setEdited(false);
        setSaving(false);
        dispatch(showGlobalAlert(AlertMessages.SAVED));
        closeModal();
      })
      .catch(() => {
        setSaving(false);
        dispatch(showGlobalErrorAlert());
      });
  };

  return (
    <AddPatientModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <MainContentWrapper>
        <Header>Patient list builder</Header>
        <Spacing vertical={5} />
        <Grid container alignItems="flex-end">
          <ListInfo>
            <ListName>{listName}</ListName>
            {listDescription && (
              <ListDescription>{listDescription}</ListDescription>
            )}
          </ListInfo>
          <Spacing horizontal={4} />
          <Button variant="text" onClick={handleEditList} size="small">
            Edit
          </Button>
        </Grid>
        <Spacing vertical={5} />
        <PatientsSection>
          <Column width={320}>
            <Header>Add patients</Header>
            <Spacing vertical={4} />
            <PatientList onSelect={handleSelectPatient} />
          </Column>
          <Spacing horizontal={4} />
          <Column>
            <Header>Included patients in list</Header>
            <Spacing vertical={4} />
            <SelectedPatientsWrapper>
              {!fetchingPatients ? (
                <>
                  {selectedPatients?.length > 0 ? (
                    selectedPatients?.map(
                      ({
                        patientIdentifier,
                        lastName,
                        firstName,
                        mrn,
                        age,
                        gender,
                      }) => (
                        <SelectedPatientRow>
                          <SelectedPatientCell>
                            {lastName || '-'}, {firstName || '-'}
                          </SelectedPatientCell>
                          <SelectedPatientCell>
                            {mrn || '-'}
                          </SelectedPatientCell>
                          <SelectedPatientCell>
                            {age || '-'}
                          </SelectedPatientCell>
                          <SelectedPatientCell>
                            {gender
                              ? gender.charAt(0).toUpperCase() + gender.slice(1)
                              : '-'}
                          </SelectedPatientCell>
                          <SelectedPatientCell>
                            <button
                              type="button"
                              onClick={() =>
                                deleteSelectedPatient(patientIdentifier)
                              }
                            >
                              <DeleteIcon />
                            </button>
                          </SelectedPatientCell>
                        </SelectedPatientRow>
                      ),
                    )
                  ) : (
                    <EmptyListText>List is empty</EmptyListText>
                  )}
                </>
              ) : null}
            </SelectedPatientsWrapper>
          </Column>
        </PatientsSection>
      </MainContentWrapper>
      <Spacing vertical={4} />
      <Grid container direction="row" justify="flex-end">
        <Button variant="secondary" onClick={closeModal} size="small">
          Cancel
        </Button>
        <Spacing horizontal={4} />
        <Button
          disabled={!edited || saving}
          onClick={handleSavePatients}
          size="small"
        >
          Save patient list
        </Button>
      </Grid>
    </AddPatientModalWrapper>
  );
};

export default AddPatientToListModal;

/* eslint-disable import/extensions */
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import pluck from 'ramda/src/pluck';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { updatePatientsList, getPatientsByListId } from 'api/patients-api';
import { openModal } from 'modal/actions';
import { Grid } from '@mui/material';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import PatientList from 'components/patients/PatientDropdown/PatientList';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import { userProfileSelector } from 'selectors/user-selectors';
import { createPatientListPath } from 'routing/helpers/paths';
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
  workspaceIdentifier
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [fetchingPatients, setFetchingPatients] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [saving, setSaving] = useState(false);
  const [edited, setEdited] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const { patientListIdentifier, listName, listDescription } =
    patientsList || {};

  const currentUser = useSelector(userProfileSelector);

  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);

  useEffect(() => {
    setFetchingPatients(true);
    getPatientsByListId(patientListIdentifier)
      .then((patients) => {
        setSelectedPatients(patients);
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
    (patient) => {
      setSelectedPatients((previousSelection) => {
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

  const deleteSelectedPatient = (patientIdentifierToDelete) => {
    setSelectedPatients((previousSelection) =>
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
      .then((updatedList) => {
        if (updatedList.patients) {
          setSelectedPatients(updatedList.patients);
        }
        setEdited(false);
        setSaving(false);
        dispatch(showGlobalAlert(AlertMessages.SAVED));
        closeModal();
        history.push(createPatientListPath(patientListIdentifier));
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
        <Header>{customerTypeLabelCapitalized} list builder</Header>
        <Spacing vertical={5} />
        <Grid container alignItems="flex-end">
          <ListInfo>
            <ListName>{listName}</ListName>
            {listDescription && (
              <ListDescription>{listDescription}</ListDescription>
            )}
          </ListInfo>
          <Spacing horizontal={4} />
          <Button
            width="100px"
            variant="text"
            onClick={handleEditList}
            size="small"
          >
            Edit
          </Button>
        </Grid>
        <Spacing vertical={5} />
        <PatientsSection>
          <Column width={320}>
            <Header>Add {customerTypeLabel}s</Header>
            <Spacing vertical={4} />
            <PatientList onSelect={handleSelectPatient} workspaceIdentifier={workspaceIdentifier} />
          </Column>
          <Spacing horizontal={4} />
          <Column maxHeight={325}>
            <Header>Included {customerTypeLabel}s in list</Header>
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
      <Grid container direction="row" justifyContent="flex-end">
        <Button
          variant="secondary"
          width="150px"
          onClick={closeModal}
          size="small"
        >
          Cancel
        </Button>
        <Spacing horizontal={4} />
        <Button
          width="200px"
          disabled={!edited || saving}
          onClick={handleSavePatients}
          size="small"
        >
          Save {customerTypeLabel} list
        </Button>
      </Grid>
    </AddPatientModalWrapper>
  );
};

export default AddPatientToListModal;

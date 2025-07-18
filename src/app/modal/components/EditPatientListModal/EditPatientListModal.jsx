import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as PatientsApi from 'api/patients-api';
import { FormProvider, useForm } from 'react-hook-form';
import { Grid } from '@mui/material';
import { openModal } from 'modal/actions';
import FormInput from 'components/common/Input/FormInput';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalize } from 'helpers/capitalize';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  EditPatientListModalWrapper,
  Title,
  ButtonWrapper,
  Header,
  StyledForm,
} from './styled';
import { CloseIconButton, CloseIcon } from '../styled';

const validatePatientListName = (value) => {
  if (![...value]?.filter((char) => char !== ' ').length > 0) {
    return 'This field is required';
  }

  return true;
};

const onSubmit =
  ({ patientListIdentifier, event, dispatch, setIsSaving, workspaceIdentifier }) =>
  (data) => {
    event.stopPropagation();
    event.preventDefault();

    setIsSaving(true);

    const errorCallback = () => {
      dispatch(showGlobalErrorAlert());
      setIsSaving(false);
    };

    if (patientListIdentifier) {
      PatientsApi.updatePatientsList(patientListIdentifier, data)
        .then((updatedPatientList) => {
          setIsSaving(false);
          dispatch(showGlobalAlert(AlertMessages.UPDATED));
          dispatch(
            openModal('AddPatientToList', { patientsList: updatedPatientList }),
          );
        })
        .catch(errorCallback);
    } else {
      PatientsApi.createPatientsList(data, workspaceIdentifier)
        .then((createdPatientList) => {
          setIsSaving(false);
          dispatch(showGlobalAlert(AlertMessages.CREATED));
          dispatch(
            openModal('AddPatientToList', { patientsList: createdPatientList }),
          );
        })
        .catch(errorCallback);
    }
  };

const EditPatientListModal = ({ closeModal, patientsList, workspaceIdentifier }) => {
  const dispatch = useDispatch();
  const [isSaving, setIsSaving] = useState(false);

  const formMethods = useForm({
    defaultValues: {
      listName: patientsList?.listName || '',
      listDescription: patientsList?.listDescription || '',
    },
    reValidateMode: 'onSubmit',
  });

  const { handleSubmit } = formMethods;

  const currentUser = useSelector(userProfileSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelCapitalized = capitalize(customerTypeLabel);

  return (
    <EditPatientListModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <StyledForm
        onSubmit={(event) =>
          handleSubmit(
            onSubmit({
              event,
              dispatch,
              setIsSaving,
              patientListIdentifier: patientsList?.patientListIdentifier,
              workspaceIdentifier,
            }),
          )(event)
        }
      >
        <FormProvider {...formMethods}>
          <Grid container direction="column" justifyContent="space-between">
            <Grid item>
              <Header>
                <Title>
                  {patientsList ? 'Edit' : 'Create'} a {customerTypeLabel} list
                </Title>
              </Header>
              <FormInput
                autoFocus
                fullWidth
                label={`${customerTypeLabelCapitalized} list name`}
                name="listName"
                required
                placeholder={`Add your ${customerTypeLabel} list name here`}
                validate={validatePatientListName}
              />
              <Spacing vertical={4} />
              <FormInput
                fullWidth
                label="Description"
                name="listDescription"
                placeholder="Do you want to add a description for the list?"
              />
              <Spacing vertical={4} />
            </Grid>
            <Grid container direction="row" justifyContent="center">
              <ButtonWrapper>
                <Button
                  fullWidth
                  variant="secondary"
                  onClick={closeModal}
                  size="small"
                >
                  Cancel
                </Button>
              </ButtonWrapper>
              <Spacing horizontal={3} />
              <ButtonWrapper>
                <Button
                  fullWidth
                  type="submit"
                  disabled={isSaving}
                  size="small"
                >
                  Save
                </Button>
              </ButtonWrapper>
            </Grid>
          </Grid>
        </FormProvider>
      </StyledForm>
    </EditPatientListModalWrapper>
  );
};

export default EditPatientListModal;

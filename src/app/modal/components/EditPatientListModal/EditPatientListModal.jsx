import React, { useState, useEffect, useRef } from 'react';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import * as PatientsApi from 'api/patients-api';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';
import { openModal } from 'modal/actions';
import Input from 'components/common/Input/Input';
import Spacing from 'components/common/Spacing';
import Button from 'components/common/Button/Button';
import {
  EditPatientListModalWrapper,
  Title,
  ButtonWrapper,
  Header,
  StyledForm,
} from './styled';
import { CloseIconButton, CloseIcon } from '../styled';

const onSubmit = ({
  patientListIdentifier,
  event,
  dispatch,
  setIsSaving,
}) => data => {
  event.stopPropagation();
  event.preventDefault();

  setIsSaving(true);

  const errorCallback = () => {
    dispatch(showGlobalErrorAlert());
    setIsSaving(false);
  };

  if (!patientListIdentifier) {
    PatientsApi.createPatientsList(data)
      .then(createdPatientList => {
        setIsSaving(false);
        dispatch(showGlobalAlert(AlertMessages.CREATED));
        dispatch(
          openModal('AddPatientToList', { patientsList: createdPatientList }),
        );
      })
      .catch(errorCallback);
  } else {
    PatientsApi.updatePatientsList(patientListIdentifier, data)
      .then(updatedPatientList => {
        setIsSaving(false);
        dispatch(showGlobalAlert(AlertMessages.UPDATED));
        dispatch(
          openModal('AddPatientToList', { patientsList: updatedPatientList }),
        );
      })
      .catch(errorCallback);
  }
};

const EditPatientListModal = ({ closeModal, patientsList }) => {
  const dispatch = useDispatch();
  const [isSaving, setIsSaving] = useState(false);
  const nameReference = useRef(null);

  const formContext = useForm({
    defaultValues: {
      listName: patientsList?.listName || '',
      listDescription: patientsList?.listDescription || '',
    },
    reValidateMode: 'onSubmit',
  });

  const { register, errors, unregister, handleSubmit, watch } = formContext;

  const nameValue = watch('listName');
  const descriptionValue = watch('listDescription');

  useEffect(() => {
    register(
      {
        name: 'listName',
      },
      {
        validate: value => {
          if (![...value]?.filter(char => char !== ' ').length > 0) {
            return 'This field is required';
          }

          return true;
        },
      },
    );

    register({ name: 'listDescription' });

    // eslint-disable-next-line no-unused-expressions
    nameReference?.current?.focus();

    return () => {
      unregister('listName');
      unregister('listDescription');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EditPatientListModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <StyledForm
        onSubmit={event =>
          handleSubmit(
            onSubmit({
              event,
              dispatch,
              setIsSaving,
              patientListIdentifier: patientsList?.patientListIdentifier,
            }),
          )(event)
        }
      >
        <Grid container direction="column" justify="space-between">
          <Grid item>
            <Header>
              <Title>{patientsList ? 'Edit' : 'Create'} a patient list</Title>
            </Header>
            <Input
              ref={element => {
                nameReference.current = element;
                register(element);
              }}
              fullWidth
              label="Patient list name"
              name="listName"
              required
              showError
              centerizedLabelOnStart
              placeholder="Add your patient list name here"
              value={nameValue}
              error={errors?.['listName']?.message}
            />
            <Spacing vertical={4} />
            <Input
              ref={register}
              fullWidth
              label="Description"
              name="listDescription"
              centerizedLabelOnStart
              placeholder="Do you want to add a description for the list?"
              value={descriptionValue}
              error={errors?.['listDescription']?.message}
            />
            <Spacing vertical={4} />
          </Grid>
          <Grid container direction="row" justify="center">
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
              <Button fullWidth type="submit" disabled={isSaving} size="small">
                Save
              </Button>
            </ButtonWrapper>
          </Grid>
        </Grid>
      </StyledForm>
    </EditPatientListModalWrapper>
  );
};

export default EditPatientListModal;

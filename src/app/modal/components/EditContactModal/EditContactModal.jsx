import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, CircularProgress, Grid } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import FormInput from 'components/common/Input/FormInput';
import Button from 'components/common/Button/Button';
import FormSelect from 'components/common/Select/FormSelect';
import AlertMessages from 'alert/AlertMessages';
import FormInputWithMask from 'components/common/Input/FormInputWithMask';
import { saveContact, editContact } from 'api/contacts-api';
import { yupResolver } from '@hookform/resolvers/yup';
import { CloseIconButton, CloseIcon } from '../styled';
import {
  AddPatientFieldModalWrapper,
  Title,
  ButtonGroupFlexStyled,
  ContactStepFormStyled,
} from './styled';
import { typeOptions, validationSchema } from './helpers';

const EditContactModal = ({ closeModal, contact, onAdded, onUpdated }) => {
  const editMode = !!contact;
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();

  const formMethods = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onSubmit',
    defaultValues: contact,
  });

  const onSubmit = async data => {
    setIsSaving(true);

    try {
      if (editMode) {
        const response = await editContact(data);
        if (typeof onUpdated === 'function') onUpdated(response);
      } else {
        const response = await saveContact(data);
        if (typeof onAdded === 'function') onAdded(response);
      }

      dispatch(showGlobalAlert(AlertMessages.SAVED));
    } catch {
      dispatch(showGlobalErrorAlert());
    } finally {
      closeModal();
      setIsSaving(false);
    }
  };

  return (
    <AddPatientFieldModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Title>{editMode ? 'Edit' : 'Add'} contact</Title>
      <Box m={2} />
      <Box display="flex" flex={1} width="100%">
        <FormProvider {...formMethods}>
          <ContactStepFormStyled onSubmit={formMethods.handleSubmit(onSubmit)}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <FormSelect
                  name="type"
                  label="Type"
                  placeholder="Type of contact"
                  autoFocus
                  options={typeOptions}
                  shrink
                />
              </Grid>
              <Grid item>
                <FormInput
                  type="text"
                  name="name"
                  label="Contact Name"
                  placeholder="Type the contact name"
                  shrink
                />
              </Grid>
              <Grid item>
                <FormInput
                  name="email"
                  label="Email"
                  placeholder="Type the email address"
                  shrink
                />
              </Grid>
              <Grid item>
                <FormInput
                  name="mobilePhoneNumber"
                  label="Phone"
                  placeholder="Type the phone number"
                  shrink
                />
              </Grid>
              <Grid item>
                <FormInputWithMask
                  mask="999-999-9999"
                  name="faxPhoneNumber"
                  label="Fax"
                  placeholder="type the fax number"
                />
              </Grid>

              <Grid item>
                <FormInput type="text" name="notes" label="Notes" shrink />
              </Grid>
              <Grid item>
                <ButtonGroupFlexStyled disabled={isSaving}>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    endIcon={
                      isSaving ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null
                    }
                  >
                    {editMode ? 'edit' : 'save'}
                  </Button>
                </ButtonGroupFlexStyled>
              </Grid>
            </Grid>
          </ContactStepFormStyled>
        </FormProvider>
      </Box>
    </AddPatientFieldModalWrapper>
  );
};

export default EditContactModal;

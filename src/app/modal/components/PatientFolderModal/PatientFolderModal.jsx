import React from 'react';
import { Box, Grid } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from 'components/common/Input/FormInput';
import { CloseIconButton, CloseIcon } from '../styled';
import { ListFormModalWrapper, Title, StyledForm } from './styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

const validateFolderName = (value) => {
  if (!value || ![...value]?.filter((char) => char !== ' ').length > 0) {
    return 'This field is required';
  }

  return true;
};

const PatientFolderModal = ({
  title,
  inputLabel,
  currentName,
  closeModal,
  onChange,
}) => {
  const formMethods = useForm({
    mode: 'onSubmit',
    defaultValues: {
      name: currentName,
    },
  });

  const { handleSubmit } = formMethods;

  function submit(data) {
    if (data.name !== currentName) {
      onChange(data.name);
    } else {
      closeModal();
    }
  }

  return (
    <ListFormModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Title>{title}</Title>
      <Box m={3} />
      <StyledForm onSubmit={handleSubmit(submit)}>
        <FormProvider {...formMethods}>
          <FormInput
            autoFocus
            required
            label={inputLabel}
            name="name"
            validate={validateFolderName}
          />
          <Grid container direction="row" justifyContent="flex-end">
            <CancelButton onClick={closeModal}>Cancel</CancelButton>
            <Box mx={1} />
            <ConfirmButton type="submit">Save</ConfirmButton>
          </Grid>
        </FormProvider>
      </StyledForm>
    </ListFormModalWrapper>
  );
};

export default PatientFolderModal;

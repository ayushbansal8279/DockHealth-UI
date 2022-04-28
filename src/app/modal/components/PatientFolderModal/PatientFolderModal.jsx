import React from 'react';
import { Box, Grid } from '@material-ui/core';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from 'components/common/Input/FormInput';
import Button from 'components/common/Button/Button';
import { CloseIconButton, CloseIcon } from '../styled';
import { ListFormModalWrapper, Title, StyledForm } from './styled';

const validateTemplateName = value => {
  if (!value || ![...value]?.filter(char => char !== ' ').length > 0) {
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
            validate={validateTemplateName}
          />
          <Grid container direction="row" justify="flex-end">
            <Button
              width="auto"
              variant="secondary"
              onClick={closeModal}
              size="small"
            >
              Cancel
            </Button>
            <Box mx={1} />
            <Button fullWidth type="submit" size="small" width="auto">
              Save
            </Button>
          </Grid>
        </FormProvider>
      </StyledForm>
    </ListFormModalWrapper>
  );
};

export default PatientFolderModal;

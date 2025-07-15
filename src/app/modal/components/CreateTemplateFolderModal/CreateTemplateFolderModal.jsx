import React from 'react';
import { Box, Grid } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as TaskTemplateActions from 'actions/task-template-actions';
import FormInput from 'components/common/Input/FormInput';
import Spacing from 'components/common/Spacing';
import { CloseIconButton, CloseIcon } from '../styled';
import { ListFormModalWrapper, Header, Title, StyledForm } from './styled';
import { CancelButton, ConfirmButton } from '../ModalButton/ModalButtons';

const TEMPLATE_NAME_FIELD_NAME = 'name';

const validateTemplateName = (value) => {
  if (!value || ![...value]?.filter((char) => char !== ' ').length > 0) {
    return 'This field is required';
  }

  return true;
};

function createSubmit({
  onCreateSuccess,
  closeModal,
  event,
  dispatch,
  workspaceIdentifier,
}) {
  return function onSubmit(data) {
    event.preventDefault();
    dispatch(
      TaskTemplateActions.addTemplateFolder(data, null, workspaceIdentifier),
    );
    if (typeof onCreateSuccess === 'function') onCreateSuccess(data);
    closeModal();
  };
}

const CreateTemplateFolderModal = ({
  closeModal,
  onCreateSuccess,
  workspaceIdentifier,
}) => {
  const dispatch = useDispatch();
  const formMethods = useForm({
    mode: 'onSubmit',
  });
  const { handleSubmit } = formMethods;

  return (
    <ListFormModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Header>
        <Title>Create a folder</Title>
      </Header>
      <StyledForm
        onSubmit={(event) =>
          handleSubmit(
            createSubmit({
              event,
              onCreateSuccess,
              closeModal,
              dispatch,
              workspaceIdentifier,
            }),
          )(event)
        }
      >
        <FormProvider {...formMethods}>
          <FormInput
            autoFocus
            required
            label="Folder name"
            name={TEMPLATE_NAME_FIELD_NAME}
            placeholder="What would you like to name this folder?"
            validate={validateTemplateName}
          />
          <Box display={'flex'} direction="row" justifyContent="center">
            <CancelButton onClick={closeModal}>Cancel</CancelButton>
            <Spacing horizontal={3} />
            <ConfirmButton type="submit">Save</ConfirmButton>
          </Box>
        </FormProvider>
      </StyledForm>
    </ListFormModalWrapper>
  );
};

export default CreateTemplateFolderModal;

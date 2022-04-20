import React from 'react';
import { Grid } from '@material-ui/core';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as TaskTemplateActions from 'actions/task-template-actions';
import FormInput from 'components/common/Input/FormInput';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import { CloseIconButton, CloseIcon } from '../styled';
import { ListFormModalWrapper, Header, Title, StyledForm } from './styled';

const TEMPLATE_NAME_FIELD_NAME = 'name';

const validateTemplateName = value => {
  if (!value || ![...value]?.filter(char => char !== ' ').length > 0) {
    return 'This field is required';
  }

  return true;
};

function createSubmit({
  onCreateSuccess,
  closeModal,
  event,
  dispatch,
  history,
}) {
  return function onSubmit(data) {
    event.preventDefault();
    dispatch(TaskTemplateActions.addSmartFlow(data, history));
    if (typeof onCreateSuccess === 'function') onCreateSuccess(data);
    closeModal();
  };
}

const CreateSmartFlowModal = ({ closeModal, onCreateSuccess }) => {
  const dispatch = useDispatch();
  const history = useHistory();
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
        <Title>Create a SmartFlow</Title>
      </Header>
      <StyledForm
        onSubmit={event =>
          handleSubmit(
            createSubmit({
              event,
              onCreateSuccess,
              closeModal,
              dispatch,
              history,
            }),
          )(event)
        }
      >
        <FormProvider {...formMethods}>
          <FormInput
            autoFocus
            required
            label="SmartFlow name"
            name={TEMPLATE_NAME_FIELD_NAME}
            placeholder="What would you like to name this SmartFlow?"
            validate={validateTemplateName}
          />
          <Grid container direction="row" justify="center">
            <Button
              width="170px"
              variant="secondary"
              onClick={closeModal}
              size="small"
            >
              Cancel
            </Button>
            <Spacing horizontal={3} />
            <Button fullWidth type="submit" size="small" width="170px">
              Save
            </Button>
          </Grid>
        </FormProvider>
      </StyledForm>
    </ListFormModalWrapper>
  );
};

export default CreateSmartFlowModal;

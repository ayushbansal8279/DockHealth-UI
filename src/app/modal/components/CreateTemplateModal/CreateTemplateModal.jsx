import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { FormContext, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as TaskTemplateActions from 'actions/task-template-actions';
import FormInput from 'components/common/Input/FormInput';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import { CloseIconButton, CloseIcon, FlexButtonWrapper } from '../styled';
import { ListFormModalWrapper, Header, Title, StyledForm } from './styled';

const TEMPLATE_NAME_FIELD_NAME = 'name';

function createSubmit({ onCreateSuccess, closeModal, event, dispatch }) {
  return function onSubmit(data) {
    event.preventDefault();
    dispatch(TaskTemplateActions.addTemplate(data));
    if (typeof onCreateSuccess === 'function') onCreateSuccess(data);
    closeModal();
  };
}

const CreateTemplateModal = ({ closeModal, onCreateSuccess }) => {
  const dispatch = useDispatch();
  const formMethods = useForm({
    mode: 'onSubmit',
  });
  const { register, unregister, handleSubmit } = formMethods;

  useEffect(() => {
    register(
      {
        name: TEMPLATE_NAME_FIELD_NAME,
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

    return () => {
      unregister(TEMPLATE_NAME_FIELD_NAME);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListFormModalWrapper>
      <CloseIconButton onClick={closeModal} size="small" color="secondary">
        <CloseIcon />
      </CloseIconButton>
      <Header>
        <Title>Create a workflow</Title>
      </Header>
      <StyledForm
        onSubmit={event =>
          handleSubmit(
            createSubmit({ event, onCreateSuccess, closeModal, dispatch }),
          )(event)
        }
      >
        <FormContext {...formMethods}>
          <FormInput
            autoFocus
            required
            label="Workflow name"
            name={TEMPLATE_NAME_FIELD_NAME}
            placeholder="What would you like to name this workflow?"
          />
          <Grid container direction="row" justify="center">
            <FlexButtonWrapper>
              <Button
                fullWidth
                variant="secondary"
                onClick={closeModal}
                size="small"
              >
                Cancel
              </Button>
            </FlexButtonWrapper>
            <Spacing horizontal={3} />
            <FlexButtonWrapper>
              <Button fullWidth type="submit" size="small">
                Save
              </Button>
            </FlexButtonWrapper>
          </Grid>
        </FormContext>
      </StyledForm>
    </ListFormModalWrapper>
  );
};

export default CreateTemplateModal;

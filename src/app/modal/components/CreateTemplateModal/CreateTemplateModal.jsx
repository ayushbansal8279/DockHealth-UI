import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as TaskTemplateActions from 'actions/task-template-actions';
import Input from 'components/common/Input/Input';
import Button from 'components/common/Button/Button';
import Spacing from 'components/common/Spacing';
import { CloseIconButton, CloseIcon, FixedWidthButtonWrapper } from '../styled';
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
  const { register, unregister, watch, errors, handleSubmit } = useForm({
    mode: 'onSubmit',
  });

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
        <Input
          ref={register}
          autoFocus
          fullWidth
          required
          showError
          label="Workflow name"
          value={watch(TEMPLATE_NAME_FIELD_NAME)}
          name={TEMPLATE_NAME_FIELD_NAME}
          placeholder="What would you like to name this workflow?"
          error={errors?.[TEMPLATE_NAME_FIELD_NAME]?.message}
        />
        <Grid container direction="row" justify="center">
          <FixedWidthButtonWrapper width={170}>
            <Button
              fullWidth
              variant="outlined"
              onClick={closeModal}
              size="small"
            >
              Cancel
            </Button>
          </FixedWidthButtonWrapper>
          <Spacing horizontal={3} />
          <FixedWidthButtonWrapper width={170}>
            <Button fullWidth type="submit" size="small">
              Save
            </Button>
          </FixedWidthButtonWrapper>
        </Grid>
      </StyledForm>
    </ListFormModalWrapper>
  );
};

export default CreateTemplateModal;

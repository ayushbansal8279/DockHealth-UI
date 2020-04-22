import { Grid } from '@material-ui/core';
import React, { useRef } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { invitePersonToOrganization } from 'actions/people-actions';
import palette from 'app/palette';
import StyledInput from '../userProfileView/StyledInput';
import { inviteValidationSchema } from './TaskDrawer.ValidationSchema';

const BottomFormLabel = styled.button`
  align-items: center;
  color: ${palette.lightCyanBlue};
  cursor: pointer;
  display: flex;
  height: 3.5rem;
  justify-content: center;
  margin-top: 0.5rem;
  transition: all 0.25s ease-out;
  width: 100%;

  &:hover {
    filter: brightness(1.25);
  }

  ${props => props.bold && 'font-weight: 600;'}
`;

const formFieldDefinitions = [
  {
    key: 'firstName',
    label: 'First Name',
    required: true,
  },
  {
    key: 'lastName',
    label: 'Last Name',
    required: true,
  },
  {
    key: 'email',
    label: 'Email',
    required: true,
  },
];

const renderFormFieldDefinition = ({ key, label, size, ...props }) => {
  return (
    <Grid key={key} item xs={size ?? 12}>
      <StyledInput
        backgroundColor={palette.white}
        containerHeight={3.5}
        containerMarginTop={0}
        fontSize={16}
        label={label}
        labelFontSize={14}
        labelInactiveTop={1.75}
        name={key}
        {...props}
      />
    </Grid>
  );
};

// eslint-disable-next-line unicorn/consistent-function-scoping
const onSubmit = ({ dispatch, handlePersonSelect, toggleAddingNewPerson }) => {
  return async data => {
    try {
      await invitePersonToOrganization(data)(dispatch);
      toggleAlert('New person invited successfully', 'success');
      toggleAddingNewPerson();
      handlePersonSelect(data)();
    } catch {
      toggleAlert('Error inviting new person, please try again later', 'error');
    }
  };
};

export default ({ handlePersonSelect, toggleAddingNewPerson }) => {
  const formMethods = useForm({
    validationSchema: inviteValidationSchema,
  });
  const dispatch = useDispatch();

  const formReference = useRef(null);

  const { handleSubmit } = formMethods;

  return (
    <FormContext {...formMethods}>
      <form
        onSubmit={event => {
          event.preventDefault();
          event.stopPropagation();

          return handleSubmit(
            onSubmit({ dispatch, handlePersonSelect, toggleAddingNewPerson }),
          )(event);
        }}
        ref={formReference}
      >
        <Grid container spacing={1}>
          {formFieldDefinitions.map(renderFormFieldDefinition)}
          <Grid item container xs={12} justify="center">
            <Grid item xs={3}>
              <BottomFormLabel
                onClick={event => {
                  event.preventDefault();
                  event.stopPropagation();

                  toggleAddingNewPerson();
                }}
              >
                Cancel
              </BottomFormLabel>
            </Grid>
            <Grid item xs={3}>
              <BottomFormLabel bold type="submit">
                Send invite
              </BottomFormLabel>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </FormContext>
  );
};

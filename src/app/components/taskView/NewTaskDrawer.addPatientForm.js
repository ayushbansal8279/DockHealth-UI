import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Popover from '@material-ui/core/Popover';
import React, { useRef } from 'react';
import useForm, { FormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { addPatient } from '../../actions/patient-actions';
import useBoolean from '../../hooks/useBoolean';
import StyledInput from '../userProfileView/StyledInput';
import validationSchema from './NewTaskDrawer.validationSchema';

const FormLabel = styled.div`
  color: #0ca1c7;
  font-size: 1rem;
  font-weight: 600;
  height: 2.5rem;
`;

const BottomFormLabel = styled.button`
  align-items: center;
  color: #009fcd;
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
    size: 4,
  },
  {
    key: 'middleName',
    label: 'Middle Name',
    required: true,
    size: 4,
  },
  {
    key: 'lastName',
    label: 'Last Name',
    required: true,
    size: 4,
  },
  {
    key: 'mrn',
    label: 'MRN',
  },
  {
    key: 'dob',
    label: 'Birthday',
    isBirthDate: true,
  },
  {
    key: 'genderLabel',
    label: 'Gender',
    popoverOptions: [
      {
        key: 'female',
        label: 'Female',
      },
      {
        key: 'male',
        label: 'Male',
      },
      {
        key: 'other',
        label: 'Other',
      },
    ],
    setValuesFromPopover: [
      ({ setValue, option: { key } }) => setValue('gender', key),
      ({ setValue, option: { label } }) => setValue('genderLabel', label),
    ],
  },
  {
    key: 'phoneHome',
    label: 'Home Phone',
    isPhoneNumber: true,
  },
  {
    key: 'phoneMobile',
    label: 'Mobile Phone',
    isPhoneNumber: true,
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'notes',
    label: 'Notes',
    isTextarea: true,
  },
];

const renderFormFieldDefinition = ({ setValue }) => ({
  key,
  label,
  size,
  isTextarea = false,
  popoverOptions,
  setValuesFromPopover,
  ...props
}) => {
  const inputRef = useRef(null);
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);

  const inputPopoverProps = popoverOptions
    ? {
        controlled: true,
        onContainerClick: openPopover,
      }
    : {};

  return (
    <Grid key={key} item xs={size ?? 12}>
      <StyledInput
        backgroundColor="#fff"
        containerHeight={isTextarea ? 6.6875 : 3.5}
        containerMarginTop={isTextarea ? 1.1875 : 0}
        fontSize={16}
        isTextarea={isTextarea}
        label={label}
        labelFontSize={14}
        labelInactiveTop={1.75}
        name={key}
        ref={inputRef}
        {...inputPopoverProps}
        {...props}
      />
      {popoverOptions && (
        <Popover
          anchorEl={inputRef.current}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={closePopover}
          open={isPopoverOpen}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <List>
            {popoverOptions.map(option => {
              const { key: optionKey, label: optionLabel } = option;
              return (
                <ListItem
                  button
                  key={optionKey}
                  onClick={() => {
                    setValuesFromPopover.forEach(setValueMethod =>
                      setValueMethod({ setValue, option }),
                    );
                    closePopover();
                  }}
                >
                  {optionLabel}
                </ListItem>
              );
            })}
          </List>
        </Popover>
      )}
    </Grid>
  );
};

const onSubmit = ({ dispatch, toggleAddingNewPerson }) => async data => {
  try {
    await addPatient(data)(dispatch);
    toggleAlert('Patient added successfully', 'success');
    toggleAddingNewPerson();
  } catch {
    toggleAlert('Error adding new patient, please try again later', 'error');
  }
};

export default ({ toggleAddingNewPerson }) => {
  const formMethods = useForm({
    validationSchema,
  });
  const dispatch = useDispatch();

  const formRef = useRef(null);

  const { handleSubmit, register, setValue } = formMethods;

  return (
    <FormContext {...formMethods}>
      <form
        onSubmit={event => {
          event.preventDefault();
          event.stopPropagation();

          return handleSubmit(onSubmit({ dispatch, toggleAddingNewPerson }))(
            event,
          );
        }}
        ref={formRef}
      >
        <FormLabel>Patient details</FormLabel>
        <Grid container spacing={8}>
          <input type="hidden" name="gender" ref={register} />
          {formFieldDefinitions.map(renderFormFieldDefinition({ setValue }))}
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
                Save
              </BottomFormLabel>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </FormContext>
  );
};

import { Grid, List, ListItem, Popover } from '@material-ui/core';
import React, { useRef } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { addPatient } from 'actions/patient-actions';
import useBoolean from 'hooks/useBoolean';
import DropdownIcon from 'img/dropdown-icon.svg';
import palette from 'styles/palette';
import * as AlertActions from 'alert/actions';
import StyledInput from './StyledInput/StyledInput';
import { addPatientValidationSchema } from './TaskDrawer.ValidationSchema';

const FormLabel = styled.div`
  color: ${palette.lighterCyanBlue};
  font-size: 1rem;
  font-weight: 600;
  height: 2.5rem;
`;

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

const DropdownIconContainer = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
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
  const inputReference = useRef(null);
  const [isPopoverOpen, openPopover, closePopover] = useBoolean(false);

  const inputPopoverProps = popoverOptions
    ? {
        controlled: true,
        onContainerClick: openPopover,
      }
    : {};

  return (
    <Grid key={key} container item xs={size ?? 12} alignItems="flex-end">
      <Grid item xs>
        <StyledInput
          backgroundColor={palette.white}
          containerHeight={isTextarea ? 6.6875 : 3.5}
          containerMarginTop={isTextarea ? 1.1875 : 0}
          containerMarginTopOnError={0.75}
          fontSize={16}
          isTextarea={isTextarea}
          label={label}
          labelFontSize={14}
          labelInactiveTop={1.75}
          name={key}
          ref={inputReference}
          rightAdornment={
            popoverOptions ? (
              <DropdownIconContainer>
                <img src={DropdownIcon} alt="dropdown" />
              </DropdownIconContainer>
            ) : (
              undefined
            )
          }
          {...inputPopoverProps}
          {...props}
        />
      </Grid>
      {popoverOptions && (
        <Popover
          anchorEl={inputReference.current}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={closePopover}
          open={isPopoverOpen}
          PaperProps={{
            style: {
              width: inputReference.current?.offsetWidth,
            },
          }}
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

const onSubmit = ({
  dispatch,
  closePicker,
  handlePersonSelect,
  toggleAddingNewPerson,
}) => {
  return async data => {
    try {
      const newData = {
        ...data,
        dob: data.dob || null,
      };

      const newPatient = await addPatient(newData)(dispatch);
      dispatch(
        AlertActions.showGlobalAlert('Patient added successfully', 'success'),
      );
      toggleAddingNewPerson();
      handlePersonSelect(newPatient)();
      closePicker();
    } catch {
      dispatch(
        AlertActions.showGlobalAlert(
          'Error adding new patient, please try again later',
          'error',
        ),
      );
    }
  };
};

export default ({ closePicker, handlePersonSelect, toggleAddingNewPerson }) => {
  const formMethods = useForm({
    validationSchema: addPatientValidationSchema,
  });
  const dispatch = useDispatch();

  const formReference = useRef(null);

  const { handleSubmit, register, setValue } = formMethods;

  return (
    <FormContext {...formMethods}>
      <form
        onSubmit={event => {
          event.preventDefault();
          event.stopPropagation();

          return handleSubmit(
            onSubmit({
              dispatch,
              closePicker,
              handlePersonSelect,
              toggleAddingNewPerson,
            }),
          )(event);
        }}
        ref={formReference}
      >
        <FormLabel>Patient details</FormLabel>
        <Grid container spacing={1}>
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

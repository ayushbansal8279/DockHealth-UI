import { Button, Grid } from '@material-ui/core';
import { shape, string, func } from 'prop-types';
import React from 'react';
import { FormContext } from 'react-hook-form';

import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import { RobotoTypography } from 'styles/theme';

import { noop } from 'helpers/utility-functions';
import InputPopover from './NewTaskDrawer.InputPopover';
import initializeAddPatientPopoverHooks from './NewTaskDrawer.AddPatientPopover.Hooks';
import { FormContainer } from './NewTaskDrawer.AddPatientPopover.Styled';
import TextInput from './NewTaskDrawer.TextInput';

const AddPatientPopover = ({
  anchorElement,
  isPopoverOpen,
  closePopover,
  initialValue,
  setParentFormValue,
}) => {
  const { formMethods, onSubmit, isAdding } = initializeAddPatientPopoverHooks({
    closePopover,
    initialValue,
    isPopoverOpen,
    setParentFormValue,
  });

  const { handleSubmit } = formMethods;

  return (
    <InputPopover
      anchorElement={anchorElement}
      isPopoverOpen={isPopoverOpen}
      closePopover={closePopover}
    >
      <FormContext {...formMethods}>
        <FormContainer>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextInput
                  name="firstName"
                  label="First Name"
                  required
                  placeholder="Type the first name of patient to add"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  name="lastName"
                  label="Last Name"
                  required
                  placeholder="Type the last name of patient to add"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Spacing vertical={3} />
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  size="small"
                  disabled={isAdding}
                >
                  <Grid
                    container
                    wrap="nowrap"
                    justify="center"
                    alignItems="center"
                  >
                    <RobotoTypography variant="h4" condensed>
                      Add patient
                    </RobotoTypography>
                    {isAdding && (
                      <>
                        <Spacing horizontal={3} />
                        <Loader size={LoaderSizes.small} />
                      </>
                    )}
                  </Grid>
                </Button>
              </Grid>
            </Grid>
          </form>
        </FormContainer>
      </FormContext>
    </InputPopover>
  );
};

AddPatientPopover.propTypes = {
  ...InputPopover.propTypes,
  initialValue: string,
  taskList: shape({
    taskListIdentifier: string.isRequired,
  }),
  setParentFormValue: func,
};

AddPatientPopover.defaultProps = {
  ...InputPopover.defaultProps,
  initialValue: '',
  taskList: {},
  setParentFormValue: noop,
};

export default AddPatientPopover;

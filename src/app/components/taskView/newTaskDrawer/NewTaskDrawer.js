/* eslint-disable react/jsx-no-duplicate-props */
import { Button, Divider, Grid } from '@material-ui/core';
import React from 'react';
import { FormContext } from 'react-hook-form';

import CubesLoader from 'components/common/CubesLoader';
import Spacing from 'components/common/Spacing';
import palette from 'styles/palette';
import { RobotoTypography } from 'styles/theme';
import { MontserratTypography } from 'styles/theme-montserrat';

import DueDateSection from './NewTaskDrawer.DueDateSection';
import initializeTaskDrawerHooks from './NewTaskDrawer.Hooks';
import PrioritySection from './NewTaskDrawer.PrioritySection';
import SelectInput from './NewTaskDrawer.SelectInput';
import StatusSection from './NewTaskDrawer.StatusSection';
import {
  AdornmentContainer,
  HiddenFieldContainer,
  TaskDrawerContainer,
} from './NewTaskDrawer.Styled';
import TextInput from './NewTaskDrawer.TextInput';
import {
  getFormattedMembers,
  getFormattedPatients,
} from './NewTaskDrawer.Utilities';

const NewTaskDrawer = ({ members }) => {
  const {
    taskDrawerOpen,
    top,
    onSubmit,
    formMethods,
    isAddingOrEditingSubtask,
    patients,
    currentAssignedToAdornment,
    closeTaskDrawer,
    isSaving,
  } = initializeTaskDrawerHooks({ members });

  const { handleSubmit, watch } = formMethods;

  const formattedPatients = getFormattedPatients({ patients });
  const formattedMembers = getFormattedMembers({ members });

  const dueDateValue = watch('dueDate');

  return (
    <TaskDrawerContainer open={taskDrawerOpen} top={top}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContext {...formMethods}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextInput
                name="description"
                label={isAddingOrEditingSubtask ? 'Subtask' : 'Task'}
                required
                placeholder="What is the task?"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: <AdornmentContainer>+</AdornmentContainer>,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <SelectInput
                name="patientIdentifier"
                label="Patient"
                placeholder="Who is the patient?"
                noOptionsText={
                  <RobotoTypography condensed variant="h4" color="default">
                    No record found
                  </RobotoTypography>
                }
                InputProps={{
                  startAdornment: <AdornmentContainer>+</AdornmentContainer>,
                }}
              >
                {formattedPatients}
              </SelectInput>
            </Grid>
            <Grid item xs={6}>
              <SelectInput
                name="assignedToIdentifier"
                label="Assigned To"
                placeholder="Who would you like to assign this task to?"
                noOptionsText={
                  <RobotoTypography condensed variant="h4" color="inherit">
                    No record found
                  </RobotoTypography>
                }
                InputProps={{
                  startAdornment: <AdornmentContainer>+</AdornmentContainer>,
                  endAdornment: currentAssignedToAdornment,
                }}
              >
                {formattedMembers}
              </SelectInput>
            </Grid>
            <Grid item xs={6}>
              <DueDateSection />
            </Grid>
            <Grid item xs={6}>
              <HiddenFieldContainer visible={dueDateValue}>
                <TextInput
                  name="dueTime"
                  label="Due Time"
                  placeholder="12:00 PM"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </HiddenFieldContainer>
            </Grid>
            <Grid item xs={6}>
              <PrioritySection />
            </Grid>
            <Grid item xs={6}>
              <StatusSection />
            </Grid>
            <Grid item xs={12}>
              {/* Layout-element only for now - waiting for backend implementation */}
              <SelectInput
                name="labels"
                label="Labels"
                placeholder="Are there labels you'd like to add?"
                noOptionsText={
                  <RobotoTypography condensed variant="h4" color="inherit">
                    No labels found
                  </RobotoTypography>
                }
                InputProps={{
                  startAdornment: <AdornmentContainer>+</AdornmentContainer>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid
              item
              xs={12}
              container
              justify="flex-end"
              alignItems="center"
              wrap="nowrap"
            >
              <Button
                onClick={closeTaskDrawer}
                color="secondary"
                variant="text"
                size="small"
                disabled={isSaving}
              >
                <MontserratTypography
                  weight="600"
                  textDecoration="underline"
                  color="inherit"
                  variant="h4"
                >
                  CANCEL
                </MontserratTypography>
              </Button>
              <Spacing horizontal={3} />
              <Button
                variant="contained"
                size="small"
                type="submit"
                disableRipple={isSaving}
                disabled={isSaving}
              >
                <MontserratTypography variant="h4" weight="600">
                  {isSaving ? (
                    <CubesLoader size={32} color={palette.coolGrey1} />
                  ) : (
                    'SAVE'
                  )}
                </MontserratTypography>
              </Button>
            </Grid>
          </Grid>
        </FormContext>
      </form>
    </TaskDrawerContainer>
  );
};

export default NewTaskDrawer;

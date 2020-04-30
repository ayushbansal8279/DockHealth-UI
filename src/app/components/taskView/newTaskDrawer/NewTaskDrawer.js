/* eslint-disable react/jsx-no-duplicate-props */
import { Button, Grid } from '@material-ui/core';
import React from 'react';
import { FormContext } from 'react-hook-form';

import CubesLoader from 'components/common/CubesLoader';
import Spacing from 'components/common/Spacing';
import InboxIcon from 'img/drawer/InboxIcon';
import palette from 'styles/palette';
import { RobotoTypography } from 'styles/theme';
import { MontserratTypography } from 'styles/theme-montserrat';

import AddPatientPopover from './NewTaskDrawer.AddPatientPopover';
import AtttachmentsSection from './NewTaskDrawer.AttachmentsSection';
import CommentSection from './NewTaskDrawer.CommentSection';
import DueDateSection from './NewTaskDrawer.DueDateSection';
import initializeTaskDrawerHooks from './NewTaskDrawer.Hooks';
import initializeTaskDrawerPopoverHooks from './NewTaskDrawer.PopoverHooks';
import InviteMemberPopover from './NewTaskDrawer.InviteMemberPopover';
import LabelsSection from './NewTaskDrawer.LabelsSection';
import PrioritySection from './NewTaskDrawer.PrioritySection';
import SelectInput from './NewTaskDrawer.SelectInput';
import StatusSection from './NewTaskDrawer.StatusSection';
import {
  AdornmentContainer,
  EnvelopeIconContainer,
  HiddenFieldContainer,
  TaskDrawerContainer,
} from './NewTaskDrawer.Styled';
import TextInput from './NewTaskDrawer.TextInput';
import {
  getFormattedMembers,
  getFormattedPatients,
} from './NewTaskDrawer.Utilities';

const NewTaskDrawer = ({ members, taskList, isInbox }) => {
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
    selectedTask,
  } = initializeTaskDrawerHooks({ members, isInbox });

  const selectedTaskIdentifier = selectedTask?.taskIdentifier;

  const { handleSubmit, setValue, watch } = formMethods;

  const formattedPatients = getFormattedPatients({ patients });
  const formattedMembers = getFormattedMembers({ members });

  const dueDateValue = watch('dueDate');

  const {
    patientInputReference,
    isPatientPopoverOpen,
    openPatientPopover,
    closePatientPopover,
    patientInputValue,
    onPatientInputChange,
    assignedToInputReference,
    isInvitePopoverOpen,
    openInvitePopover,
    closeInvitePopover,
    assignedToInputValue,
    onAssignedToInputChange,
  } = initializeTaskDrawerPopoverHooks();

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
                onInputChange={onPatientInputChange}
                ref={patientInputReference}
                noOptionsText={
                  <Grid container direction="column">
                    <RobotoTypography condensed variant="h4" color="inherit">
                      No record found
                    </RobotoTypography>
                    <Spacing vertical={3} />
                    <Button
                      variant="contained"
                      fullWidth
                      size="small"
                      onMouseDown={openPatientPopover}
                    >
                      <RobotoTypography condensed variant="h4">
                        Add patient
                      </RobotoTypography>
                    </Button>
                  </Grid>
                }
                InputProps={{
                  startAdornment: <AdornmentContainer>+</AdornmentContainer>,
                }}
              >
                {formattedPatients}
              </SelectInput>
              <AddPatientPopover
                anchorElement={patientInputReference}
                isPopoverOpen={isPatientPopoverOpen}
                closePopover={closePatientPopover}
                initialValue={patientInputValue}
                setParentFormValue={setValue}
              />
            </Grid>
            <Grid item xs={6}>
              <SelectInput
                name="assignedToIdentifier"
                label="Assigned To"
                placeholder="Who would you like to assign this task to?"
                onInputChange={onAssignedToInputChange}
                ref={assignedToInputReference}
                noOptionsText={
                  <Grid container direction="column">
                    <RobotoTypography condensed variant="h4" color="inherit">
                      No record found
                    </RobotoTypography>
                    <Spacing vertical={3} />
                    <Button
                      variant="contained"
                      fullWidth
                      size="small"
                      onMouseDown={openInvitePopover}
                    >
                      <EnvelopeIconContainer>
                        <InboxIcon />
                      </EnvelopeIconContainer>
                      <Spacing horizontal={3} />
                      <RobotoTypography condensed variant="h4">
                        Invite to the list
                      </RobotoTypography>
                    </Button>
                  </Grid>
                }
                InputProps={{
                  startAdornment: <AdornmentContainer>+</AdornmentContainer>,
                  endAdornment: currentAssignedToAdornment,
                }}
              >
                {formattedMembers}
              </SelectInput>
              <InviteMemberPopover
                anchorElement={assignedToInputReference}
                isPopoverOpen={isInvitePopoverOpen}
                closePopover={closeInvitePopover}
                initialValue={assignedToInputValue}
                setParentFormValue={setValue}
                taskList={taskList}
              />
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
              <LabelsSection
                selectedTaskIdentifier={selectedTaskIdentifier}
                isInbox={isInbox}
              />
            </Grid>
            <Grid item xs={12}>
              <AtttachmentsSection />
            </Grid>
            <Grid item xs={12}>
              <CommentSection />
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

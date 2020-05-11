/* eslint-disable react/jsx-no-duplicate-props */
import { Button, Grid, Divider } from '@material-ui/core';
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
import TopSection from './NewTaskDrawer.TopSection';
import HistorySection from './NewTaskDrawer.HistorySection';
import SelectInput from './NewTaskDrawer.SelectInput';
import StatusSection from './NewTaskDrawer.StatusSection';
import TaskDrawerEmailBodyContainer from './NewTaskDrawer.EmailBody';
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
  // renderPartsWithHighlighting,
} from './NewTaskDrawer.Utilities';

const NewTaskDrawer = ({ members, taskList, isInbox }) => {
  const {
    taskDrawerOpen,
    top,
    onSubmit,
    formMethods,
    isAddingOrEditingSubtask,
    patients,
    taskLists,
    currentAssignedToAdornment,
    // getMemberAdornment,
    closeTaskDrawer,
    isSaving,
    selectedTask,
    currentUser,
    reFileTask,
    onDelete,
    onDuplicate,
  } = initializeTaskDrawerHooks({ members, isInbox, taskList });

  const selectedTaskIdentifier = selectedTask?.taskIdentifier;

  const { handleSubmit, setValue, watch } = formMethods;

  const formattedPatients = getFormattedPatients({ patients });
  const formattedMembers = getFormattedMembers({ members, currentUser });

  const dueDateValue = watch('dueDate');
  // const givenTime = String(moment(selectedTask?.dueDate).format('h:mm a'));
  const dueTimeValue = watch('dueTime');

  // console.log("Info arriving to NewTaskDrawer: " + givenTime);

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
            <TopSection
              formMethods={formMethods}
              taskLists={taskLists}
              selectedTask={selectedTask}
              taskList={taskList}
              reFileTask={reFileTask}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              isInbox={isInbox}
              closeTaskDrawer={closeTaskDrawer}
            />
            <Grid item xs={12}>
              <TextInput
                name="description"
                label={isAddingOrEditingSubtask ? 'Subtask' : 'Task'}
                required
                multiple
                placeholder="What is the task?"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment:
                    selectedTask && selectedTask.description !== '' ? (
                      ''
                    ) : (
                      <AdornmentContainer>+</AdornmentContainer>
                    ),
                }}
              />
            </Grid>
            {selectedTask?.sourceMessage && (
              <Grid item xs={12}>
                <TaskDrawerEmailBodyContainer
                  emailBody={selectedTask.sourceMessage}
                  task={selectedTask}
                  members={members}
                />
              </Grid>
            )}
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
                endAdornment={false}
                startAdornment
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
                renderItem={option =>
                  // renderItem={(option, { inputValue }) =>
                  // <MemberLabelContainer>
                  //   <CondensedH4>
                  //     {renderPartsWithHighlighting(
                  //       option?.displayLabel,
                  //       inputValue,
                  //     )}
                  //   </CondensedH4>
                  //   {getMemberAdornment(option.value, members)}
                  // </MemberLabelContainer>
                  option?.label
                }
                InputProps={{
                  startAdornment: <AdornmentContainer>+</AdornmentContainer>,
                  endAdornment: currentAssignedToAdornment,
                }}
                endAdornment={false}
                startAdornment
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
              <DueDateSection selectedTask={selectedTask} />
            </Grid>
            <Grid item xs={6}>
              <HiddenFieldContainer visible={dueDateValue}>
                <TextInput
                  name="dueTime"
                  label="Due Time"
                  // placeholder="12:35 PM"
                  // placeholder={givenTime}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    type: 'time',
                  }}
                  inputProps={{
                    step: 300, // 5 min
                    style: {
                      color: dueTimeValue ? palette.black : palette.coolGrey3,
                    },
                  }}
                />
              </HiddenFieldContainer>
            </Grid>
            <Grid item xs={6}>
              <PrioritySection selectedTask={selectedTask} />
            </Grid>
            <Grid item xs={6}>
              <StatusSection selectedTask={selectedTask} />
            </Grid>
            <Grid item xs={12}>
              <LabelsSection
                selectedTaskIdentifier={selectedTaskIdentifier}
                isInbox={isInbox}
              />
            </Grid>
            <Grid item xs={12}>
              <AtttachmentsSection selectedTask={selectedTask} />
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
      <Grid container item xs={12}>
        <Spacing vertical={4} />
        <Divider
          style={{
            width: '100%',
            backgroundColor: palette.blueOcean,
            opacity: '0.3',
          }}
        />
        <HistorySection
          formMethods={formMethods}
          taskLists={taskLists}
          selectedTask={selectedTask}
          taskList={taskList}
          isInbox={isInbox}
          closeTaskDrawer={closeTaskDrawer}
        />
      </Grid>
    </TaskDrawerContainer>
  );
};

export default NewTaskDrawer;

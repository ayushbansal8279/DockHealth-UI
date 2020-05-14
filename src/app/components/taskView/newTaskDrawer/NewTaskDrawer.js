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
  styleTaskDrawerContainer,
  styleFullRow,
  styleFullRowThin,
  styleEmailRow,
  styleLeftColumn,
  styleRightColumn,
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
    handleAssignedToSelect,
    handlePatientSelect,
    handleTaskDescriptionUpdate,
    autoSaveVisible,
    setAutoSaveVisible,
  } = initializeTaskDrawerHooks({ members, isInbox, taskList });

  const selectedTaskIdentifier = selectedTask?.taskIdentifier;

  const { handleSubmit, setValue, watch } = formMethods;

  const formattedPatients = getFormattedPatients({ patients });
  const formattedMembers = getFormattedMembers({ members, currentUser });

  const dueDateValue = watch('dueDate');
  const dueTimeValue = watch('dueTime');

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
          <Grid container spacing={2} style={styleTaskDrawerContainer}>
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
              autoSaveVisible={autoSaveVisible}
              setAutoSaveVisible={setAutoSaveVisible}
            />
            <Grid item xs={12} style={styleFullRow}>
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
                onBlur={event => {
                  if (selectedTask && selectedTask.taskIdentifier != null) {
                    event.preventDefault();
                    handleTaskDescriptionUpdate();
                  }
                }}
              />
            </Grid>
            {selectedTask?.sourceMessage && (
              <Grid item xs={12} style={styleEmailRow}>
                <TaskDrawerEmailBodyContainer
                  emailBody={selectedTask.sourceMessage}
                  task={selectedTask}
                  members={members}
                />
              </Grid>
            )}
            <Grid item xs={6} style={styleLeftColumn}>
              <SelectInput
                name="patientIdentifier"
                label="Patient"
                placeholder="Who is the patient?"
                onInputChange={onPatientInputChange}
                onItemSelected={handlePatientSelect}
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
            <Grid item xs={6} style={styleRightColumn}>
              <SelectInput
                name="assignedToIdentifier"
                label="Assigned To"
                placeholder="Who would you like to assign this task to?"
                onInputChange={onAssignedToInputChange}
                onItemSelected={handleAssignedToSelect}
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
            <Grid item xs={6} style={styleLeftColumn}>
              <DueDateSection
                selectedTask={selectedTask}
                setAutoSaveVisible={setAutoSaveVisible}
              />
            </Grid>
            <Grid item xs={6} style={styleRightColumn}>
              <HiddenFieldContainer visible={dueDateValue}>
                <TextInput
                  name="dueTime"
                  label="Due Time"
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
            <Grid item xs={6} style={styleLeftColumn}>
              <PrioritySection
                selectedTask={selectedTask}
                setAutoSaveVisible={setAutoSaveVisible}
              />
            </Grid>
            <Grid item xs={6} style={styleRightColumn}>
              <StatusSection
                selectedTask={selectedTask}
                setAutoSaveVisible={setAutoSaveVisible}
              />
            </Grid>
            <Grid item xs={12} style={styleFullRow}>
              <LabelsSection
                selectedTaskIdentifier={selectedTaskIdentifier}
                isInbox={isInbox}
              />
            </Grid>
            <Grid item xs={12} style={styleFullRow}>
              <AtttachmentsSection selectedTask={selectedTask} />
            </Grid>
            <Grid item xs={12} style={styleFullRow}>
              <CommentSection />
            </Grid>
            <Grid
              item
              xs={12}
              container
              justify="flex-end"
              alignItems="center"
              wrap="nowrap"
              style={styleFullRowThin}
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
      <Grid container item xs={12} style={styleFullRowThin}>
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

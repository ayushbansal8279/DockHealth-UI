/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/jsx-no-duplicate-props */
import { Button, Grid, Divider } from '@material-ui/core';
import React, { useRef, useEffect, useState } from 'react';
import { FormContext } from 'react-hook-form';
import moment from 'moment';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import MentionsEditor from 'components/common/MentionsEditor/MentionsEditor';
import InboxIcon from 'img/drawer/InboxIcon';
import palette from 'styles/palette';
import { RobotoTypography } from 'styles/theme';
import { MontserratTypography } from 'styles/theme-montserrat';
import AtttachmentsSection from './NewTaskDrawer.AttachmentsSection';
import CommentSection from './NewTaskDrawer.CommentSection';
import DueDateSection from './NewTaskDrawer.DueDateSection';
import DueTimeSection from './NewTaskDrawer.DueTimeSection';
import initializeTaskDrawerHooks from './NewTaskDrawer.Hooks';
import initializeTaskDrawerPopoverHooks from './NewTaskDrawer.PopoverHooks';
import initializeDueDateSectionHooks from './NewTaskDrawer.DueDateSection.Hooks';
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
  AdornmentClear,
  EnvelopeIconContainer,
  HiddenFieldContainer,
  TaskDrawerContainer,
  TaskDrawerBackground,
  styleTaskDrawerContainer,
  styleFullRow,
  styleEmailRow,
  styleLeftColumn,
  styleRightColumn,
  styleLastRow,
  styleCommentRow,
  DescriptionContainer,
} from './NewTaskDrawer.Styled';
import TextInput from './NewTaskDrawer.TextInput';
import {
  getFormattedMembers,
  getFormattedPatients,
  renderMemberoptionWithHighlighting,
  FocusDrawerFieldEnum,
  TaskDrawerFields,
} from './NewTaskDrawer.Utilities';
import existingUserTaskDrawerTourHooks from './NewTaskDrawer.ExistingUserTourHooks';

const NewTaskDrawer = ({
  isInbox,
  modalActions,
  refreshList,
  disabledFileds = [],
  fromFirstAddTask = false,
  assignToSelf = false,
}) => {
  const {
    taskDrawerOpen,
    taskDrawerFocusField,
    top,
    onSubmit,
    formMethods,
    isAddingOrEditingSubtask,
    patients,
    isLoadingPatients,
    taskLists,
    currentAssignedToAdornment,
    closeTaskDrawer,
    isSaving,
    selectedTask,
    currentUser,
    reFileTask,
    onDelete,
    onDuplicate,
    onAddSubTask,
    handleAssignedToSelect,
    handlePatientSelect,
    handleTaskDescriptionUpdate,
    setAutoSaveVisible,
    members,
    clearSelectedPatient,
    dueTimeReference,
    onPatientInputChange,
    patientInputReference,
    refreshMembers,
    taskListIdentifier,
    handleAddPatient,
    taskInputReference,
    descriptionState,
    setDescriptionState,
    descriptionReference,
  } = initializeTaskDrawerHooks({ isInbox, refreshList });

  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);

  const taskDrawerReference = useRef(null);

  const {
    taskMenuReference,
    dueDateSectionReference,
    statusSectionReference,
    labelsSectionReference,
    commentsSectionReference,
    historySectionReference,
    renderExistingUserTourPopover,
  } = existingUserTaskDrawerTourHooks({
    taskDrawerOpen,
    fromFirstAddTask,
    taskDrawerReference,
  });

  const { saveDueDate } = initializeDueDateSectionHooks({
    setAutoSaveVisible,
    refreshList,
  });

  const { handleSubmit, setValue, watch } = formMethods;

  const formattedPatients = getFormattedPatients({ patients });
  const formattedMembers = getFormattedMembers({
    members,
    isFetchingMembers: true,
    currentUser,
  });

  const dueDateValue = watch('dueDate');
  const dueTimeValue = dueTimeReference?.current?.value;

  const isDueTimeEmpty = !(
    dueTimeReference?.current?.value &&
    dueTimeReference?.current?.value !== '' &&
    dueTimeReference?.current?.value !== '__:__ __'
  );
  const isOverDue =
    dueDateValue && !isDueTimeEmpty
      ? moment(`${dueDateValue} ${dueTimeValue}`).isBefore(moment())
      : dueDateValue && moment(dueDateValue).isBefore(moment().startOf('day'));

  const selectedPatientIdentifier = watch('patientIdentifier');

  const enteredDescription = watch('description');

  const {
    assignedToInputReference,
    isInvitePopoverOpen,
    openInvitePopover,
    closeInvitePopover,
    assignedToInputValue,
    onAssignedToInputChange,
  } = initializeTaskDrawerPopoverHooks();

  useEffect(() => {
    if (
      patientInputReference?.current &&
      taskDrawerFocusField === FocusDrawerFieldEnum.PATIENT
    )
      patientInputReference.current.querySelector('input').focus();
  }, [taskDrawerFocusField, patientInputReference]);

  useEffect(() => {
    if (!selectedTask || selectedTask.description === '') {
      setTimeout(() => {
        descriptionReference.current.focus();
      }, 0);
    }
  }, [descriptionReference, isAddingOrEditingSubtask, selectedTask]);

  const parentFormSubmit = handleSubmit(onSubmit);

  const newTaskFlag = !(selectedTask && selectedTask.taskIdentifier != null);

  const isAddingSubtask =
    selectedTask &&
    selectedTask.taskIdentifier === null &&
    selectedTask.parentTaskIdentifier !== null;

  return (
    <>
      <TaskDrawerContainer
        open={taskDrawerOpen}
        top={top}
        onClose={() => closeTaskDrawer()}
        ref={taskDrawerReference}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContext {...formMethods}>
            <Grid container style={styleTaskDrawerContainer}>
              <TopSection
                formMethods={formMethods}
                taskLists={taskLists}
                selectedTask={selectedTask}
                taskList={selectedTask?.taskList}
                reFileTask={reFileTask}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onAddSubTask={onAddSubTask}
                assignToSelf={assignToSelf}
                isInbox={isInbox}
                closeTaskDrawer={closeTaskDrawer}
                setAutoSaveVisible={setAutoSaveVisible}
                modalActions={modalActions}
                setTourTaskMenuReference={element => {
                  taskMenuReference.current = element;
                }}
              />
              <Spacing vertical={2} />
              <Grid item xs={12} style={styleFullRow}>
                <TextInput
                  name="description"
                  label={isAddingOrEditingSubtask ? 'Subtask' : 'Task'}
                  required
                  multiple
                  placeholder={
                    isAddingOrEditingSubtask
                      ? 'What is the subtask?'
                      : 'What is the task?'
                  }
                  borderOnFocus
                  ref={taskInputReference}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    type: 'text',
                    startAdornment:
                      (selectedTask && selectedTask.description !== '') ||
                      enteredDescription !== '' ? (
                        ''
                      ) : (
                        <AdornmentContainer>+</AdornmentContainer>
                      ),
                    onKeyDown: event => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        parentFormSubmit();
                        return false;
                      }
                      return true;
                    },
                  }}
                  onBlur={event => {
                    if (selectedTask && selectedTask.taskIdentifier != null) {
                      event.preventDefault();
                      handleTaskDescriptionUpdate();
                    }
                  }}
                />
                <DescriptionContainer isFocused={isDescriptionFocused}>
                  <MentionsEditor
                    ref={descriptionReference}
                    placeholder="What is the task?"
                    onFocus={() => {
                      setIsDescriptionFocused(true);
                    }}
                    onBlur={() => {
                      // handleTaskDescriptionUpdate();
                      setIsDescriptionFocused(false);
                    }}
                    taskListIdentifier={taskListIdentifier}
                    state={descriptionState}
                    onChange={setDescriptionState}
                    keyBindingFn={event => {
                      if (event.keyCode === 13) {
                        return 'enter-command';
                      }
                      return undefined;
                    }}
                    handleKeyCommand={command => {
                      if (command === 'enter-command') {
                        // addCommentReference.current.blur();/
                        return 'handled';
                      }

                      return 'not-handled';
                    }}
                  />
                </DescriptionContainer>
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
                  renderItem={option => option.label}
                  placeholder="Who is the patient?"
                  disabled={disabledFileds.includes(TaskDrawerFields.PATIENT)}
                  onInputChange={onPatientInputChange}
                  onItemSelected={async (option, event) => {
                    await handlePatientSelect(option);
                    patientInputReference.current.querySelector('input').blur();
                    if (event.key === 'Enter') {
                      assignedToInputReference.current
                        .querySelector('input')
                        .focus();
                    }
                  }}
                  ref={patientInputReference}
                  noOptionsText={
                    <Grid
                      container
                      direction="column"
                      style={{ padding: '10px 10px' }}
                    >
                      {isLoadingPatients ? (
                        <Grid container justify="center" alignItems="center">
                          <Loader size={LoaderSizes.small} />
                        </Grid>
                      ) : (
                        <RobotoTypography
                          condensed
                          variant="h4"
                          color="inherit"
                        >
                          No record found
                        </RobotoTypography>
                      )}
                    </Grid>
                  }
                  InputProps={{
                    endAdornment:
                      selectedTask &&
                      selectedPatientIdentifier &&
                      !disabledFileds.includes(TaskDrawerFields.PATIENT) ? (
                        <AdornmentClear onClick={clearSelectedPatient} />
                      ) : (
                        ''
                      ),
                  }}
                  endAdornmentActionLabel={
                    isLoadingPatients ? null : 'Add patient'
                  }
                  onEndAdornmentAcionClick={handleAddPatient}
                  endAdornmentEnabled
                  autoFocusEnabled={
                    taskDrawerOpen &&
                    taskDrawerFocusField === FocusDrawerFieldEnum.PATIENT
                  }
                >
                  {formattedPatients}
                </SelectInput>
              </Grid>
              <Grid item xs={6} style={styleRightColumn}>
                <SelectInput
                  name="assignedToIdentifier"
                  label="Assigned To"
                  placeholder="Who would you like to assign this task to?"
                  onInputChange={onAssignedToInputChange}
                  onItemSelected={async option => {
                    await handleAssignedToSelect(option);
                    refreshList();
                    assignedToInputReference.current
                      .querySelector('input')
                      .blur();
                  }}
                  ref={assignedToInputReference}
                  noOptionsText={
                    <Grid
                      container
                      direction="column"
                      style={{ padding: '10px 10px' }}
                    >
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
                  renderItem={(option, inputValue) =>
                    renderMemberoptionWithHighlighting(option, inputValue)
                  }
                  InputProps={{
                    endAdornment: currentAssignedToAdornment,
                  }}
                  endAdornmentEnabled={false}
                  showAllOptions
                >
                  {formattedMembers}
                </SelectInput>
                {selectedTask && (
                  <InviteMemberPopover
                    anchorElement={assignedToInputReference}
                    isPopoverOpen={isInvitePopoverOpen}
                    closePopover={closeInvitePopover}
                    initialValue={assignedToInputValue}
                    assignUser={handleAssignedToSelect}
                    taskList={selectedTask?.taskList}
                    refreshMembers={refreshMembers}
                    setParentFormValue={setValue}
                  />
                )}
              </Grid>
              <Grid item xs={6} style={styleLeftColumn}>
                <div ref={dueDateSectionReference}>
                  <DueDateSection
                    selectedTask={selectedTask}
                    isOverDue={isOverDue}
                    setAutoSaveVisible={setAutoSaveVisible}
                    refreshList={refreshList}
                    dueTimeReference={dueTimeReference}
                  />
                </div>
              </Grid>
              <Grid item xs={6} style={styleRightColumn}>
                <HiddenFieldContainer visible={dueDateValue}>
                  <DueTimeSection
                    dueTimeReference={dueTimeReference}
                    selectedTask={selectedTask}
                    dueDateValue={dueDateValue}
                    isOverDue={isOverDue}
                    setDueTimeValue={setValue}
                    saveDueDate={saveDueDate}
                    setAutoSaveVisible={setAutoSaveVisible}
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
                <div ref={statusSectionReference}>
                  <StatusSection
                    selectedTask={selectedTask}
                    setAutoSaveVisible={setAutoSaveVisible}
                    refreshList={refreshList}
                  />
                </div>
              </Grid>
              <Grid item xs={12} style={styleFullRow}>
                <div ref={labelsSectionReference}>
                  <LabelsSection
                    selectedTask={selectedTask}
                    isInbox={isInbox}
                    parentFormSubmit={parentFormSubmit}
                    setAutoSaveVisible={setAutoSaveVisible}
                    setSelectedLabelsValue={setValue}
                    taskDrawerFocusField={taskDrawerFocusField}
                    refreshList={refreshList}
                  />
                </div>
              </Grid>
              <Grid item xs={12} style={styleFullRow}>
                <AtttachmentsSection
                  selectedTask={selectedTask}
                  parentFormSubmit={parentFormSubmit}
                />
              </Grid>
              <Grid item xs={12} style={styleCommentRow}>
                <div ref={commentsSectionReference}>
                  <CommentSection
                    parentFormSubmit={parentFormSubmit}
                    taskDrawerFocusField={taskDrawerFocusField}
                    modalActions={modalActions}
                    taskListIdentifier={taskListIdentifier}
                  />
                </div>
              </Grid>
              {newTaskFlag && (
                <Grid
                  item
                  xs={12}
                  container
                  justify="flex-end"
                  alignItems="center"
                  wrap="nowrap"
                  style={styleFullRow}
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
                      {isSaving ? <Loader size={LoaderSizes.medium} /> : 'SAVE'}
                    </MontserratTypography>
                  </Button>
                </Grid>
              )}
            </Grid>
          </FormContext>
        </form>
        <Divider
          style={{
            width: '100%',
            backgroundColor: palette.blueOcean,
            opacity: '0.3',
          }}
        />
        <Grid container item xs={12} style={styleLastRow}>
          <Spacing vertical={2} />
          <div>
            <Spacing horizontal={5} />
            <span ref={historySectionReference} />
          </div>
          <HistorySection
            formMethods={formMethods}
            taskLists={taskLists}
            selectedTask={selectedTask}
            taskList={selectedTask?.taskList}
            isInbox={isInbox}
            closeTaskDrawer={closeTaskDrawer}
          />
        </Grid>
        {renderExistingUserTourPopover()}
      </TaskDrawerContainer>
      {taskDrawerOpen && !isAddingSubtask && (
        <TaskDrawerBackground onClick={closeTaskDrawer} />
      )}
    </>
  );
};

export default NewTaskDrawer;

/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/jsx-no-duplicate-props */
import { Button, Grid, Divider } from '@material-ui/core';
import React, { useRef, useEffect } from 'react';
import { FormContext } from 'react-hook-form';
import moment from 'moment';
import { addPatient, getAllPatients } from 'actions/patient-actions';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import InboxIcon from 'img/drawer/InboxIcon';
import palette from 'styles/palette';
import { RobotoTypography } from 'styles/theme';
import { MontserratTypography } from 'styles/theme-montserrat';
import { useDispatch } from 'react-redux';
import { noop } from 'helpers/utility-functions';
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
  styleTaskDrawerContainer,
  styleFullRow,
  styleEmailRow,
  styleLeftColumn,
  styleRightColumn,
  styleLastRow,
} from './NewTaskDrawer.Styled';
import TextInput from './NewTaskDrawer.TextInput';
import {
  getFormattedMembers,
  getFormattedPatients,
  renderMemberoptionWithHighlighting,
  FocusDrawerFieldEnum,
  ContextRefreshTriggers,
} from './NewTaskDrawer.Utilities';

const NewTaskDrawer = ({
  isInbox,
  modalActions,
  refreshList,
  refreshTriggers = [],
}) => {
  const {
    taskDrawerOpen,
    taskDrawerFocusField,
    top,
    onSubmit,
    formMethods,
    isAddingOrEditingSubtask,
    patients,
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
  } = initializeTaskDrawerHooks({ isInbox, refreshList });

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

  const isOverDue =
    dueDateValue && moment(dueDateValue).isBefore(moment().startOf('day'));

  const selectedPatientIdentifier = watch('patientIdentifier');

  const enteredDescription = watch('description');

  const {
    patientInputReference,
    onPatientInputChange,
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

  const parentFormSubmit = handleSubmit(onSubmit);

  const newTaskFlag = !(selectedTask && selectedTask.taskIdentifier != null);

  const taskDrawerReference = useRef();
  const dispatch = useDispatch();

  const handleAddPatient = patient => {
    const [firstName, ...lastNames] = patient.split(' ');

    const data = { firstName, lastName: lastNames.join(' ') };

    addPatient(data)(dispatch)
      .then(async ({ patientIdentifier, firstName: name, lastName }) => {
        await getAllPatients()(dispatch);

        handlePatientSelect({
          value: patientIdentifier,
          displayLabel: `${name} ${lastName}`,
        });
      })
      .catch(noop);
  };

  return (
    <>
      {/* {taskDrawerOpen && (
        <ClickAwayListener
          onClickAway={() => {
            closeTaskDrawer();
          }}
        > */}
      <TaskDrawerContainer
        open={taskDrawerOpen}
        top={top}
        onClose={() => closeTaskDrawer()}
        ref={taskDrawerReference}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormContext {...formMethods}>
            <Grid container spacing={1} style={styleTaskDrawerContainer}>
              <TopSection
                formMethods={formMethods}
                taskLists={taskLists}
                selectedTask={selectedTask}
                taskList={selectedTask?.taskList}
                reFileTask={reFileTask}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onAddSubTask={onAddSubTask}
                isInbox={isInbox}
                closeTaskDrawer={closeTaskDrawer}
                setAutoSaveVisible={setAutoSaveVisible}
                modalActions={modalActions}
              />
              <Spacing vertical={2} />
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
                      <RobotoTypography condensed variant="h4" color="inherit">
                        No record found
                      </RobotoTypography>
                    </Grid>
                  }
                  InputProps={{
                    endAdornment:
                      selectedTask && selectedPatientIdentifier ? (
                        <AdornmentClear onClick={clearSelectedPatient} />
                      ) : (
                        ''
                      ),
                  }}
                  endAdornmentActionLabel="Add patient"
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
                >
                  {formattedMembers}
                </SelectInput>
                <InviteMemberPopover
                  anchorElement={assignedToInputReference}
                  isPopoverOpen={isInvitePopoverOpen}
                  closePopover={closeInvitePopover}
                  initialValue={assignedToInputValue}
                  setParentFormValue={setValue}
                  taskList={selectedTask?.taskList}
                />
              </Grid>
              <Grid item xs={6} style={styleLeftColumn}>
                <DueDateSection
                  selectedTask={selectedTask}
                  isOverDue={isOverDue}
                  setAutoSaveVisible={setAutoSaveVisible}
                  refreshList={refreshList}
                  shouldRefreshContext={refreshTriggers.includes(
                    ContextRefreshTriggers.DUE_DATE_CHANGE,
                  )}
                />
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
                <StatusSection
                  selectedTask={selectedTask}
                  setAutoSaveVisible={setAutoSaveVisible}
                />
              </Grid>
              <Grid item xs={12} style={styleFullRow}>
                <LabelsSection
                  selectedTask={selectedTask}
                  isInbox={isInbox}
                  parentFormSubmit={parentFormSubmit}
                  setAutoSaveVisible={setAutoSaveVisible}
                  setSelectedLabelsValue={setValue}
                  taskDrawerFocusField={taskDrawerFocusField}
                />
              </Grid>
              <Grid item xs={12} style={styleFullRow}>
                <AtttachmentsSection
                  selectedTask={selectedTask}
                  parentFormSubmit={parentFormSubmit}
                />
              </Grid>
              <Grid item xs={12} style={styleFullRow}>
                <CommentSection
                  parentFormSubmit={parentFormSubmit}
                  taskDrawerFocusField={taskDrawerFocusField}
                  modalActions={modalActions}
                />
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
          <HistorySection
            formMethods={formMethods}
            taskLists={taskLists}
            selectedTask={selectedTask}
            taskList={selectedTask?.taskList}
            isInbox={isInbox}
            closeTaskDrawer={closeTaskDrawer}
          />
        </Grid>
      </TaskDrawerContainer>
      {/* </ClickAwayListener>
      )} */}
    </>
  );
};

export default NewTaskDrawer;

/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/jsx-no-duplicate-props */
import { Button, Grid, Divider } from '@material-ui/core';
import React, { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FormContext } from 'react-hook-form';
import moment from 'moment';
import { isNil } from 'ramda';
import { addPatient, getAllPatients } from 'actions/patient-actions';
import Loader, { LoaderSizes } from 'components/common/Loader/Loader';
import Spacing from 'components/common/Spacing';
import InboxIcon from 'img/drawer/InboxIcon';
import palette from 'styles/palette';
import { RobotoTypography } from 'styles/theme';
import { MontserratTypography } from 'styles/theme-montserrat';
import localStorageHelper from 'helpers/local-storage-helper';
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
  TaskDrawerBackground,
  styleTaskDrawerContainer,
  styleFullRow,
  styleEmailRow,
  styleLeftColumn,
  styleRightColumn,
  styleLastRow,
  styleCommentRow,
} from './NewTaskDrawer.Styled';
import TextInput from './NewTaskDrawer.TextInput';
import {
  getFormattedMembers,
  getFormattedPatients,
  renderMemberoptionWithHighlighting,
  FocusDrawerFieldEnum,
  ContextRefreshTriggers,
} from './NewTaskDrawer.Utilities';
import TaskDrawerTourContent from './TaskDrawerTourContent/TaskDrawerTourContent';
import TaskDrawerTourPopper from './TaskDrawerTourPopper/TaskDrawerTourPopper';

const TASK_DRAWER_FIRST_TIME_KEY = 'TASK_DRAWER_FIRST_TIME_KEY';

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

  const [openedTourStep, setOpenedTourStep] = useState(null);

  const taskMenuReference = useRef(null);
  const dueDateSectionReference = useRef(null);
  const statusSectionReference = useRef(null);
  const labelsSectionReference = useRef(null);
  const commentsSectionReference = useRef(null);
  const historySectionReference = useRef(null);

  const tourSteps = [
    {
      index: 0,
      reference: taskMenuReference,
      position: 'bottom-end',
      afterScrollPosition: 'start',
      title: 'Adding a Subtask & Deleting or Duplicating Tasks',
      description:
        'We’ve relocated adding a subtask, deleting and duplicating a task to here.',
    },
    {
      index: 1,
      reference: dueDateSectionReference,
      position: 'bottom-start',
      afterScrollPosition: 'start',
      title: 'Due Date & Due Time',
      description:
        'We added the ability to assign a due time for tasks. Based on a due date and time, we‘ll send alerts to remind you a task is due.',
      description2:
        'Remember that the new Home screen is organized based on due date. Adding due dates will help you stay organized and get things done on time.',
    },
    {
      index: 2,
      reference: statusSectionReference,
      position: 'top-end',
      title: 'Status',
      description:
        'You can now assign a status to a task, which will give you and others an idea of where a task is in process.',
    },
    {
      index: 3,
      reference: labelsSectionReference,
      position: 'top-end',
      title: 'Labels',
      description:
        'We’ve made it easier to search for and find tasks by adding the ability to create and assign searchable labels - like Phone Calls or Imaging - to individual to-dos.',
    },
    {
      index: 4,
      reference: commentsSectionReference,
      position: 'top-end',
      title: 'Editing & Deleting Comments',
      description:
        'Mouse over a comment to expose your ability to edit or delete a comment that you’ve made.',
    },
    {
      index: 5,
      reference: historySectionReference,
      position: 'top-start',
      title: 'Task History',
      description:
        'We’ve added the ability to view an individual task’s history of changes, so you can see each change that occurred since the task was created.',
    },
  ];

  useEffect(() => {
    if (openedTourStep) {
      const { reference, afterScrollPosition } = tourSteps[openedTourStep];

      // eslint-disable-next-line no-unused-expressions
      reference?.current.scrollIntoView({
        behavior: 'smooth',
        block: afterScrollPosition || 'center',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedTourStep]);

  useEffect(() => {
    const taskDrawerFirstTimeValue = localStorageHelper.getItem(
      TASK_DRAWER_FIRST_TIME_KEY,
    );

    if (
      taskDrawerOpen &&
      (isNil(taskDrawerFirstTimeValue) || taskDrawerFirstTimeValue)
    ) {
      setOpenedTourStep(0);
    }

    if (!taskDrawerOpen && openedTourStep !== null) {
      setOpenedTourStep(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskDrawerOpen]);

  const closeTour = () => {
    localStorageHelper.setItem(TASK_DRAWER_FIRST_TIME_KEY, false);
    setOpenedTourStep(null);
  };

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
                    if (
                      refreshTriggers.includes(
                        ContextRefreshTriggers.ASSIGNED_TO_CHANGE,
                      )
                    ) {
                      refreshList();
                    }
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
                <div ref={dueDateSectionReference}>
                  <DueDateSection
                    selectedTask={selectedTask}
                    isOverDue={isOverDue}
                    setAutoSaveVisible={setAutoSaveVisible}
                    refreshList={refreshList}
                    shouldRefreshContext={refreshTriggers.includes(
                      ContextRefreshTriggers.DUE_DATE_CHANGE,
                    )}
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
        {/* Tour popper components */}
        {openedTourStep !== null &&
          tourSteps.map(({ reference, index, position }) => (
            <TaskDrawerTourPopper
              key={index}
              anchorEl={reference?.current}
              position={position}
              open={openedTourStep === index}
            >
              <TaskDrawerTourContent
                steps={tourSteps}
                currentStepIndex={index}
                setStep={setOpenedTourStep}
                onClose={closeTour}
              />
            </TaskDrawerTourPopper>
          ))}
      </TaskDrawerContainer>
      {taskDrawerOpen && !isAddingSubtask && (
        <TaskDrawerBackground onClick={closeTaskDrawer} />
      )}
    </>
  );
};

export default NewTaskDrawer;

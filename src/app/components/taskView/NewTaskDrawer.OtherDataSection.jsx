import { List, ListItem, Popover } from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

import CubesLoader from '../common/CubesLoader';
import NewTaskDrawerOtherDataDueDate from './NewTaskDrawer.OtherDataDueDate';
import initializeNewTaskDrawerOtherDataSectionHooks from './NewTaskDrawer.OtherDataSectionHooks';
import NewTaskDrawerAttachmentsList from './NewTaskDrawer.AttachmentsList';

const OtherDataSectionContainer = styled.div`
  padding: 1rem 1.5rem;
  width: 100%;
`;

const SectionRow = styled.div`
  display: flex;

  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

const SectionButtonContainer = styled.div`
  flex: 5;
  font-size: 0.875rem;
`;

const SectionButton = styled.span`
  color: ${props => props.color ?? '#2e3a43'};
  cursor: ${props => (props.clickable ? 'pointer' : 'defualt')};
  font-size: 0.875rem;
`;

const SectionLabel = styled.div`
  color: #ababb2;
  flex: 2;
  font-size: 0.875rem;
  padding-right: 0.25rem;
`;

const HistoryLabel = styled(SectionButton)`
  cursor: default;
`;

const HistorySublabel = styled(HistoryLabel)`
  color: #ababb2;
  font-size: 0.75rem;
`;

const HistoryItemContainer = styled.div`
  display: flex;
  flex-flow: column wrap;
  margin-bottom: 0.5rem;
`;

const renderTaskList = ({
  closePopover,
  setNewTaskListName,
  setValue,
  saveTaskList,
  taskId,
}) => taskList => {
  const { taskListId, listName } = taskList;

  return (
    <ListItem
      key={taskId}
      onClick={() => {
        setValue('newTaskListId', taskListId);
        setNewTaskListName(listName);
        closePopover();
        if (taskId) {
          saveTaskList({ newTaskList: taskList });
        }
      }}
      button
    >
      {listName}
    </ListItem>
  );
};

const renderHistoryItem = ({
  auditId,
  auditEventTypeDescription,
  createdDateTime,
  user,
}) => {
  const userName = user?.userName ?? '';
  const createdMoment = moment(createdDateTime);

  // This is where the History Event timeDate is formated.
  const formattedDate = createdMoment.isValid()
    ? createdMoment.format('MMM D, YYYY @ h:mma')
    : '';

  const bottomRowData = `${formattedDate} by ${userName}`.trim();

  return (
    <HistoryItemContainer key={auditId}>
      <HistoryLabel>{auditEventTypeDescription}</HistoryLabel>
      {bottomRowData && <HistorySublabel>{bottomRowData}</HistorySublabel>}
    </HistoryItemContainer>
  );
};

const renderEmptyHistory = () => (
  <HistoryLabel>No history available</HistoryLabel>
);

const renderHistory = history => {
  if (history?.length === 0) {
    return renderEmptyHistory();
  }
  return history?.map(renderHistoryItem);
};

export default ({
  task,
  taskList,
  closeDrawer,
  setAutoSaveVisible,
  isInbox,
}) => {
  const {
    taskLists,
    currentUser,
    todaysMoment,
    register,
    setValue,
    newTaskListName,
    setNewTaskListName,
    isTaskListPopoverOpen,
    setTaskListPopoverOpen,
    unsetTaskListPopoverOpen,
    isHistoryShown,
    isHistoryLoading,
    history,
    taskListButtonReference,
    newDueDateMoment,
    clearDueDate,
    saveTaskList,
    saveDueDate,
    onToggleHistoryButtonClicked,
    taskId,
    newDueDate,
    setNewDueDate,
  } = initializeNewTaskDrawerOtherDataSectionHooks({
    task,
    setAutoSaveVisible,
    closeDrawer,
  });

  return (
    <OtherDataSectionContainer>
      {!task?.parentTaskId && (
        <SectionRow>
          <input type="hidden" name="newTaskListId" ref={register} />
          <SectionLabel>Filed In</SectionLabel>
          <SectionButtonContainer>
            {task ? (
              <SectionButton
                clickable
                ref={taskListButtonReference}
                onClick={setTaskListPopoverOpen}
              >
                {isInbox ? 'Inbox' : newTaskListName || taskList?.listName}
              </SectionButton>
            ) : (
              <SectionButton>
                {isInbox ? 'Inbox' : taskList?.listName}
              </SectionButton>
            )}
          </SectionButtonContainer>
          <Popover
            anchorEl={taskListButtonReference.current}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            disablePortal
            open={isTaskListPopoverOpen}
            onClose={unsetTaskListPopoverOpen}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <List>
              {taskLists.map(
                renderTaskList({
                  closePopover: unsetTaskListPopoverOpen,
                  setNewTaskListName,
                  setValue,
                  saveTaskList,
                  taskId,
                }),
              )}
            </List>
          </Popover>
        </SectionRow>
      )}
      <SectionRow>
        <input type="hidden" name="newTaskDueDate" ref={register} />
        <SectionLabel>Due date</SectionLabel>
        <NewTaskDrawerOtherDataDueDate
          newDueDate={newDueDate}
          setNewDueDate={setNewDueDate}
          saveDueDate={saveDueDate}
          taskId={taskId}
          newDueDateMoment={newDueDateMoment}
          clearDueDate={clearDueDate}
          SectionButtonContainer={SectionButtonContainer}
          SectionButton={SectionButton}
        />
      </SectionRow>
      {task && (
        <SectionRow>
          <SectionLabel padded>Attachments</SectionLabel>
          <SectionButtonContainer>
            <SectionButton>
              <NewTaskDrawerAttachmentsList task={task} />
            </SectionButton>
          </SectionButtonContainer>
        </SectionRow>
      )}
      <SectionRow>
        <SectionLabel>History</SectionLabel>
        <SectionButtonContainer>
          {task?.taskId ? (
            <SectionButton
              clickable
              color="#0ca1c7"
              onClick={
                isHistoryLoading ? undefined : onToggleHistoryButtonClicked
              }
            >
              {isHistoryShown ? 'Hide' : 'Show'}
            </SectionButton>
          ) : (
            `Created by ${currentUser.firstName} ${currentUser.lastName} on ${todaysMoment}`
          )}
        </SectionButtonContainer>
      </SectionRow>
      {isHistoryShown && (
        <SectionRow>
          <SectionLabel />
          <SectionButtonContainer>
            {isHistoryLoading ? (
              <CubesLoader size={16} />
            ) : (
              renderHistory(history)
            )}
          </SectionButtonContainer>
        </SectionRow>
      )}
    </OtherDataSectionContainer>
  );
};

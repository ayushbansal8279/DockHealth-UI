import { List, ListItem, Popover } from '@material-ui/core';
import moment from 'moment';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import useBoolean from '../../hooks/useBoolean';
import DateTimeSelect from '../common/DateTimeSelect';
import {
  getTaskHistory,
  updateDueDate,
  moveTask,
  storeAsCurrentTask,
} from '../../actions/task-actions';
import CubesLoader from '../common/CubesLoader';

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
  //Modified font of the history container.
  font-size: 0.875rem;
`;

const SectionButton = styled.span`
  color: ${props => props.color ?? '#2e3a43'};
  cursor: ${props => (props.clickable ? 'pointer' : 'defualt')};
  font-size: 0.875rem;
`;

const SectionLabel = styled.div`
  color: #ababb2;
  flex: 1;
  font-size: 0.875rem;
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
  const taskLists = useSelector(store => store.taskListState.tasklist) || [];
  const currentUser = useSelector(store => store.userState.userProfile);
  const todaysMoment = moment().format('MMM D, YYYY @ h:mma');

  const { register, setValue } = useFormContext();
  const dispatch = useDispatch();

  const [newTaskListName, setNewTaskListName] = useState('');
  const [newDueDate, setNewDueDate] = useState(
    new Date(task?.dueDate ? task.dueDate : undefined),
  );
  const [
    isTaskListPopoverOpen,
    setTaskListPopoverOpen,
    unsetTaskListPopoverOpen,
  ] = useBoolean(false);
  const [isHistoryShown, , hideHistory, toggleHistory] = useBoolean(false);
  const [isHistoryLoading, setHistoryLoading, unsetHistoryLoading] = useBoolean(
    false,
  );
  const [history, setHistory] = useState([]);
  const taskListButtonRef = useRef(null);

  const newDueDateMoment = moment(newDueDate);
  const taskId = task?.taskId;

  useEffect(() => {
    setValue('newTaskListId', null);
    setValue('newTaskDueDate', null);
    setNewTaskListName('');
    setHistory([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue(
      'newTaskDueDate',
      newDueDateMoment
        .set({ hour: 0, minute: 0, second: 0 })
        .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newDueDate]);

  useEffect(() => {
    if (isHistoryShown) {
      if (task) {
        getTaskHistory(task)(dispatch)
          .then(historyDetails => {
            setHistory(historyDetails);
            unsetHistoryLoading();
          })
          .catch(() => {
            unsetHistoryLoading();
          });
      }
    } else {
      setHistory([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHistoryShown]);

  useEffect(() => {
    setHistory([]);
    setNewDueDate(new Date(task?.dueDate ? task.dueDate : undefined));
    hideHistory();
    unsetHistoryLoading();
    unsetTaskListPopoverOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const onToggleHistoryButtonClicked = () => {
    if (!isHistoryShown) {
      setHistoryLoading();
    }
    toggleHistory();
  };

  const saveDueDate = useCallback(
    ({ updatedDueDate }) => {
      updateDueDate(
        task,
        moment(updatedDueDate).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      )(dispatch)
        .then(() => {
          setAutoSaveVisible();
        })
        .catch(() => {
          toggleAlert(
            'Error updating due date, please try again later',
            'error',
          );
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [taskId],
  );

  const saveTaskList = useCallback(
    ({ newTaskList }) => {
      moveTask(task, newTaskList)(dispatch)
        .then(() => {
          toggleAlert(
            `Task moved successfully to list ${newTaskList.listName}`,
            'success',
          );
          storeAsCurrentTask(null)(dispatch);
          closeDrawer();
        })
        .catch(() => {
          toggleAlert(
            `Error moving task to list ${newTaskList.listName}, please try again later`,
            'error',
          );
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [taskId],
  );

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
                ref={taskListButtonRef}
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
            anchorEl={taskListButtonRef.current}
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
        <DateTimeSelect
          value={newDueDate}
          onChange={updatedDueDate => {
            setNewDueDate(updatedDueDate);
            if (taskId) {
              saveDueDate({ updatedDueDate });
            }
          }}
          label="Set a due date"
          showTimeSelect={false}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
        >
          {({ open }) => (
            <SectionButtonContainer>
              <SectionButton clickable onClick={open}>
                {newDueDateMoment.isValid()
                  ? newDueDateMoment.format('MMM. D, YYYY')
                  : 'Set a due date'}
              </SectionButton>
            </SectionButtonContainer>
          )}
        </DateTimeSelect>
      </SectionRow>
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

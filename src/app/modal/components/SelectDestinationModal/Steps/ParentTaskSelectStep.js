/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useBoolean } from 'hooks/useBoolean';
import * as ActionTypes from 'actions/action-types';
import { addTask } from 'api/task-api';
import { getTasksForTaskListByTaskGroup } from 'api/list-details-api';
import { selectedUserOrganizationSelector } from 'selectors/user-selectors';
import { TaskItemType } from 'helpers/task-helpers';
import {
  TitleWithButtonWrapper,
  Title,
  ListItem,
  EmptyMessage,
  ListsWrapper,
  QuickAddInput,
  QuickAddInputWrapper,
  ListItemTextButton,
  Step,
} from '../styled';

const ParentTaskSelectStep = ({
  selectedList,
  selectedGroup,
  setSelectedGroup,
  selectedParentTask,
  setSelectedParentTask,
  setPreviousStep,
}) => {
  const addParentTaskReference = useRef(null);
  const [isFetchingParentTasks, setIsFetchingParentTasks] = useState(true);
  const [fetchingError, setFetchingError] = useState(null);
  const [parentTasks, setParentTasks] = useState(null);
  const [savingParentTask, setSavingParentTask] = useState(false);
  const [
    groupInputFocused,
    setGroupInputFocused,
    unsetGroupInputFocused,
  ] = useBoolean(false);
  const dispatch = useDispatch();

  const currentOrganization = useSelector(selectedUserOrganizationSelector);
  const defaultGroupNameItem =
    currentOrganization?.themeSettings?.find(
      ({ name }) => name === 'content.label.default.group',
    ) || {};

  const handleAddNewParentTask = taskDescription => {
    if (savingParentTask || !selectedList || !selectedGroup || !taskDescription)
      return;

    setSavingParentTask(true);
    addTask({
      taskListIdentifier: selectedList.taskListIdentifier,
      taskGroupIdentifier: selectedGroup.taskGroupIdentifier,
      description: taskDescription,
    })
      .then(createdParentTask => {
        setSavingParentTask(false);
        setParentTasks(previousParentTask =>
          setParentTasks([...previousParentTask, createdParentTask]),
        );
        addParentTaskReference.current.value = '';
        dispatch({
          type: ActionTypes.ADD_TASK_SUCCESS,
          task: createdParentTask,
        });
      })
      .catch(() => {
        setSavingParentTask(false);
      });
  };

  useEffect(() => {
    if (
      selectedList?.taskListIdentifier &&
      selectedGroup?.taskGroupIdentifier
    ) {
      setIsFetchingParentTasks(true);
      setParentTasks(null);
      setFetchingError(null);
      getTasksForTaskListByTaskGroup(
        selectedList.taskListIdentifier,
        selectedGroup.taskGroupIdentifier,
        'INCOMPLETE',
        0,
        null,
      )
        .then(response => {
          setParentTasks(response?.taskGroups[0]?.tasks || []);
          setIsFetchingParentTasks(false);
        })
        .catch(() => {
          setIsFetchingParentTasks(false);
          setFetchingError('Something went wrong. Please, try again later.');
        });
    }
  }, [selectedList, selectedGroup]);

  return (
    <Step>
      {selectedGroup && selectedList && (
        <>
          <TitleWithButtonWrapper>
            <button
              type="button"
              onClick={() => {
                setPreviousStep();
                setSelectedParentTask(null);
                setSelectedGroup(null);
              }}
            >
              <ArrowBackIcon />
            </button>
            <Title>
              {selectedGroup.groupName === 'DEFAULT'
                ? defaultGroupNameItem?.value || 'New tasks'
                : selectedGroup.groupName}
            </Title>
          </TitleWithButtonWrapper>
          <Box m={1} />
          <ListsWrapper>
            {!isFetchingParentTasks && (
              <>
                {parentTasks?.length > 0 ? (
                  parentTasks.map(parentTask =>
                    parentTask.itemType === TaskItemType.TASK ? (
                      <ListItem
                        key={parentTask.taskIdentifier}
                        isSelected={
                          selectedParentTask?.taskIdentifier ===
                          parentTask.taskIdentifier
                        }
                      >
                        <ListItemTextButton
                          onClick={() => setSelectedParentTask(parentTask)}
                          type="button"
                          isSelected={
                            selectedParentTask?.taskIdentifier ===
                            parentTask.taskIdentifier
                          }
                        >
                          {parentTask.description}
                        </ListItemTextButton>
                      </ListItem>
                    ) : null,
                  )
                ) : (
                  <EmptyMessage>
                    {fetchingError || 'List is empty'}
                  </EmptyMessage>
                )}
              </>
            )}
          </ListsWrapper>
          <QuickAddInputWrapper isFocused={groupInputFocused}>
            <QuickAddInput
              ref={addParentTaskReference}
              type="text"
              placeholder="Add task"
              onFocus={setGroupInputFocused}
              onBlur={unsetGroupInputFocused}
              disabled={
                savingParentTask || fetchingError || isFetchingParentTasks
              }
              onKeyDown={event =>
                event.key === 'Enter' &&
                handleAddNewParentTask(event.target.value)
              }
            />
          </QuickAddInputWrapper>
        </>
      )}
    </Step>
  );
};

export default ParentTaskSelectStep;

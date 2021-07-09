/* eslint-disable sonarjs/cognitive-complexity */
import React, { useMemo, useRef, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Collapse } from '@material-ui/core';
import ArrowIcon from 'img/arrow';
import { pluck } from 'ramda';
import * as TaskActions from 'actions/task-actions';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import TaskListMembers from 'components/tasklist/TaskListMembers/TaskListMembers';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import ViewTypeSwitch, {
  ViewType,
} from 'components/tasklist/ViewTypeSwitch/ViewTypeSwitch';
import {
  addingNewSubtaskSelector,
  subtaskShapeSelector,
  addingNewSubtaskParentIdSelector,
} from 'selectors/task-drawer-selectors';
import {
  onSlimViewChanged,
  onTaskGroupCollapsed,
  onTaskGroupExpanded,
} from 'helpers/ga-event-helper';
import { checkIfAllTasksSelected } from 'helpers/bulk-edit-helpers';
import listSectionSavedState from 'helpers/list-section-saved-state';
import { extractTasksAndSubtasks } from 'helpers/tasklist-helpers';
import TasksHeader from 'components/tasklist/TasksHeader/TasksHeader';
import {
  Arrow,
  ListDetailsContainer,
  ListDetailsHeader,
  ListNameSection,
  ListNameContainer,
  ListDescription,
} from 'components/tasklist/DropdownListSection/styled';
import TaskTemplateApplicator from 'components/task-template/TaskTemplateApplicator/TaskTemplateApplicator';
import TaskTemplateGroup from 'components/task-template/TaskTemplateGroup/TaskTemplateGroup';
import { TaskItemType } from 'helpers/task-helpers';

const TaskListDetailsDropdown = ({
  list,
  tasks,
  currentUser,
  selectedTask,
  openDrawer,
  storeAsCurrentTask,
  isCompleteTab,
  toggleTaskStatus,
  onTaskUpdate,
  updateDueDate,
  updateWorkflowStatus,
  quickAddTask,
  refreshView,
  hideSubtasks,
  sort,
  onSortChange,
  taskItemConfig,
  applyTemplate,
}) => {
  const sessionStorageKey = `${list.taskListIdentifier}-patient`;
  const { viewType, isOpen, switchOpen, setViewType } = listSectionSavedState(
    sessionStorageKey,
  );
  const quickAddTaskInputReference = useRef(null);
  const dispatch = useDispatch();
  const addingNewSubtask = useSelector(addingNewSubtaskSelector);
  const addingNewSubtaskParentId = useSelector(
    addingNewSubtaskParentIdSelector,
  );
  const subtaskShape = useSelector(subtaskShapeSelector);
  const isFullView = viewType === ViewType.FULL_VIEW;

  const { listName, taskListIdentifier, listUsers } = list;

  const listMembers = listUsers;

  const { bulkEditEnabled } = useContext(BulkEditContext);

  const groupHasMultipleAssignees = useMemo(
    () =>
      tasks.some(
        // eslint-disable-next-line no-shadow
        ({ assignedToUsers, subtasks }) =>
          (assignedToUsers && assignedToUsers.length > 1) ||
          (subtasks &&
            subtasks.length > 0 &&
            subtasks.some(
              ({ assignedToUsers: subtaskAssignedToUsers }) =>
                subtaskAssignedToUsers && subtaskAssignedToUsers.length > 1,
            )),
      ),
    [tasks],
  );

  const isGroupSelected = useMemo(() => checkIfAllTasksSelected(tasks), [
    tasks,
  ]);

  const handleGroupSelect = useCallback(() => {
    const { parentTasks, subtasks } = extractTasksAndSubtasks(tasks);
    const allTasks = [...parentTasks, ...subtasks];
    dispatch(
      TaskActions.changeTasksSelectedState(
        !isGroupSelected,
        pluck('identifier', allTasks),
      ),
    );
  }, [dispatch, isGroupSelected, tasks]);

  const handleTemplateSelect = useCallback(
    template => {
      applyTemplate({
        taskTemplateIdentifier: template.taskTemplateIdentifier,
        taskListIdentifier: list?.taskListIdentifier,
      });
    },
    [applyTemplate, list],
  );

  return (
    <ListDetailsContainer>
      <ListDetailsHeader>
        <ListNameContainer>
          <Arrow
            alt="arrow"
            isOpen={isOpen}
            onClick={() => {
              if (isOpen) {
                onTaskGroupCollapsed();
              } else {
                onTaskGroupExpanded();
              }
              switchOpen(!isOpen);
            }}
            src={ArrowIcon}
          />
          <ListNameSection>{listName}</ListNameSection>
        </ListNameContainer>
        {listMembers?.length > 0 && (
          <TaskListMembers
            members={listMembers}
            list={list}
            refreshMembers={refreshView}
          />
        )}
        <ViewTypeSwitch
          value={viewType}
          onChange={value => {
            setViewType(value);
            onSlimViewChanged(value === ViewType.SLIM_VIEW);
          }}
        />
      </ListDetailsHeader>
      <ListDescription>{list?.listDescription}</ListDescription>
      <Collapse timeout={150} in={isOpen}>
        {!isCompleteTab && (
          <Grid container direction="row">
            <Grid item xs>
              <QuickAddTaskInput
                ref={quickAddTaskInputReference}
                taskListIdentifier={list?.taskListIdentifier}
                quickAddTask={task => {
                  quickAddTask({ ...task, taskListIdentifier });
                  setTimeout(() => {
                    quickAddTaskInputReference.current.focus();
                  }, 0);
                }}
              />
            </Grid>
            {applyTemplate && (
              <TaskTemplateApplicator onTemplateSelect={handleTemplateSelect} />
            )}
          </Grid>
        )}
        <TasksHeader
          bulkEditEnabled={bulkEditEnabled}
          sort={sort}
          onSortChange={onSortChange}
          taskItemConfig={taskItemConfig}
          groupHasMultipleAssignees={groupHasMultipleAssignees}
          isGroupSelected={isGroupSelected}
          onGroupSelect={handleGroupSelect}
        />
        <>
          {tasks?.map(task =>
            task.itemType === TaskItemType.TASK ? (
              <StandardTaskItem
                key={task.identifier}
                currentUser={currentUser}
                isFullView={isFullView}
                openDrawer={openDrawer}
                storeAsCurrentTask={storeAsCurrentTask}
                task={task}
                isCompletedGroup={isCompleteTab}
                toggleCompleteTask={toggleTaskStatus}
                onTaskUpdate={onTaskUpdate}
                updateDueDate={updateDueDate}
                updateWorkflowStatus={updateWorkflowStatus}
                dragAndDropDisabled
                selectedTask={selectedTask}
                patientVisible={false}
                addingNewSubtask={addingNewSubtask}
                addingNewSubtaskParentId={addingNewSubtaskParentId}
                subtaskShape={subtaskShape}
                hideSubtasks={hideSubtasks}
                multipleAssigneesContext={groupHasMultipleAssignees}
                taskItemConfig={taskItemConfig}
              />
            ) : (
              <TaskTemplateGroup
                key={task.identifier}
                templateGroup={task}
                taskItemConfig={taskItemConfig}
                groupHasMultipleAssignees={groupHasMultipleAssignees}
                isFullView={isFullView}
                groupDragAndDropDisabled
                disablePatientAssignment
              />
            ),
          )}
        </>
      </Collapse>
    </ListDetailsContainer>
  );
};

export default TaskListDetailsDropdown;

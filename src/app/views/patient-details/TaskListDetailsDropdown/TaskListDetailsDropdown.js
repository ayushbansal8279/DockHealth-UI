/* eslint-disable sonarjs/cognitive-complexity */
import React, { useMemo, useRef, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import ArrowIcon from 'img/arrow';
import { pluck } from 'ramda';
import * as TaskActions from 'actions/task-actions';
import StandardTaskItem from 'components/task/StandardTaskItem/StandardTaskItem';
import TaskListMembers from 'components/tasklist/TaskListMembers/TaskListMembers';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';
import { BulkEditContext } from 'components/tasklist/BulkEditSection/BulkEditSection';
import Checkbox from 'components/common/Checkbox/Checkbox';
import ViewTypeSwitch, {
  ViewType,
} from 'components/tasklist/ViewTypeSwitch/ViewTypeSwitch';
import {
  onSlimViewChanged,
  onTaskGroupCollapsed,
  onTaskGroupExpanded,
} from 'helpers/ga-event-helper';
import { checkIfAllTasksSelected } from 'helpers/bulk-edit-helpers';
import listSectionSavedState from 'helpers/list-section-saved-state';
import { extractTasksAndSubtasks } from 'helpers/tasklist-helpers';
import {
  Arrow,
  Tasks,
  ListDetailsContainer,
  ListDetailsHeader,
  ListNameSection,
  ListNameContainer,
} from 'components/tasklist/DropdownListSection/styled';
import ColumnSortHeader from 'components/tasklist/ColumnSortHeader/ColumnSortHeader';
import { SortHeaderRow } from 'components/tasklist/ColumnSortHeader/styled';
import TaskTemplateApplicator from 'components/task-template/TaskTemplateApplicator/TaskTemplateApplicator';
import TaskTemplateGroup from 'components/task-template/TaskTemplateGroup/TaskTemplateGroup';
import { TaskItemType } from 'helpers/task-helpers';
import { BulkContainer } from '../styled';

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

  const {
    addingNewSubtask,
    addingNewSubtaskParentId,
    subtaskShape,
  } = useSelector(state => ({
    addingNewSubtask: state.taskState.addingNewSubtask,
    addingNewSubtaskParentId: state.taskState.addingNewSubtaskParentId,
    subtaskShape: state.taskState.subtaskShape,
  }));

  const dispatch = useDispatch();

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
      <Tasks timeout={150} in={isOpen}>
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
        <SortHeaderRow>
          {bulkEditEnabled && (
            <BulkContainer>
              <Checkbox
                isChecked={isGroupSelected}
                onClick={handleGroupSelect}
              />
            </BulkContainer>
          )}
          <ColumnSortHeader width={36} />
          <ColumnSortHeader
            id="TASK_DESCRIPTION"
            label="Tasks"
            sort={sort}
            onSortChange={onSortChange}
          />
          <ColumnSortHeader
            id="SUBTASK_COUNT"
            label="Sub"
            width={60}
            sort={sort}
            onSortChange={onSortChange}
          />
          <ColumnSortHeader
            id="WORKFLOW_STATUS"
            label="Status"
            width={120}
            sort={sort}
            onSortChange={onSortChange}
          />
          <ColumnSortHeader width={150} />
          <ColumnSortHeader
            id="DUE_DT"
            label="Date"
            width={60}
            sort={sort}
            onSortChange={onSortChange}
          />
          <ColumnSortHeader
            id="ASSIGNED_TO"
            label={groupHasMultipleAssignees ? 'Assign' : 'Asgn'}
            width={groupHasMultipleAssignees ? 90 : 60}
            sort={sort}
            onSortChange={onSortChange}
          />
        </SortHeaderRow>
        <div>
          {tasks?.map(task =>
            task.itemType === TaskItemType.TASK ? (
              <StandardTaskItem
                key={task.taskIdentifier}
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
                templateGroup={task}
                taskItemConfig={taskItemConfig}
                groupHasMultipleAssignees={groupHasMultipleAssignees}
                isFullView={isFullView}
                groupDragAndDropDisabled
              />
            ),
          )}
        </div>
      </Tasks>
    </ListDetailsContainer>
  );
};

export default TaskListDetailsDropdown;

/* eslint-disable sonarjs/cognitive-complexity */
import React, { useMemo, useRef, useContext } from 'react';
import { useSelector } from 'react-redux';
import ArrowIcon from 'img/arrow';
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
import {
  TASK_ITEM_DUE_DATE_COLUMN,
  TASK_ITEM_ICONS_COLUMN,
  TASK_ITEM_MEMBERS_COLUMN,
  TASK_ITEM_WORFKLOW_STATUS_COLUMN,
} from 'components/task/StandardTaskItem/helpers';

import listSectionSavedState from 'helpers/list-secition-saved-state';
import { checkIfTasksHaveSubtasksOrCommnets } from 'helpers/tasklist-helpers';
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
import { BulkContainer } from '../styled';

const COLUMNS_CONFIG = [
  TASK_ITEM_WORFKLOW_STATUS_COLUMN,
  TASK_ITEM_MEMBERS_COLUMN,
  TASK_ITEM_ICONS_COLUMN,
  TASK_ITEM_DUE_DATE_COLUMN,
];

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

  const areViewOptionsVisible = useMemo(() => {
    if (!isOpen) return false;

    return checkIfTasksHaveSubtasksOrCommnets(tasks);
  }, [isOpen, tasks]);

  const isFullView = viewType === ViewType.FULL_VIEW;

  const { listName, taskListIdentifier, listUsers } = list;

  const listMembers = listUsers;

  const { bunchBulkEditTaskActions = {} } = useContext(BulkEditContext);
  const { groupActions } = bunchBulkEditTaskActions;

  const subtasks = useMemo(
    () =>
      tasks && tasks?.length > 0
        ? tasks?.reduce(
            (previousSubtasks, currentTask) =>
              currentTask?.subtasks?.length > 0
                ? [...previousSubtasks, ...currentTask?.subtasks]
                : previousSubtasks,
            [],
          )
        : [],
    [tasks],
  );

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
          isHidden={!areViewOptionsVisible}
          value={viewType}
          onChange={value => {
            setViewType(value);
            onSlimViewChanged(value === ViewType.SLIM_VIEW);
          }}
        />
      </ListDetailsHeader>
      <Tasks timeout={150} in={isOpen}>
        {!isCompleteTab && (
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
        )}
        <SortHeaderRow>
          {bunchBulkEditTaskActions && (
            <BulkContainer>
              <Checkbox
                isChecked={groupActions?.getGroupIsSelectedInBulkEdit(
                  tasks,
                  subtasks,
                )}
                onClick={() =>
                  groupActions?.onClickBulkEditGroup({
                    parentTasks: tasks,
                    subtasks,
                  })
                }
              />
            </BulkContainer>
          )}
          <ColumnSortHeader width={bunchBulkEditTaskActions ? 36 : 60} />
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
          {tasks?.map(task => (
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
              taskItemConfig={COLUMNS_CONFIG}
            />
          ))}
        </div>
      </Tasks>
    </ListDetailsContainer>
  );
};

export default TaskListDetailsDropdown;

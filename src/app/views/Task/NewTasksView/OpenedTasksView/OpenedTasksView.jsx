/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { isEmpty } from 'ramda';

import { TASKGROUP_DEFAULT_TYPE } from 'api/task-group-list-api';
import ViewLoader from 'components/common/ViewLoader/ViewLoader';
import NoSearchResultsView from 'components/tasklist/EmptyListView/NoSearchResultsView';
import EmptyListViewWithQuickAddTask from 'components/tasklist/EmptyListView/EmptyListViewWithQuickAddTask';
import EmptyListView from 'components/tasklist/EmptyListView/EmptyListView';
import NoFilterResultsView from 'components/tasklist/EmptyListView/NoFilterResultsView';
import TasksGroup from '../TasksGroup/TasksGroup';
import GroupNameSection from '../GroupNameSection/GroupNameSection';
import messages from '../AddGroupNameButton/messages';
import AddGroupNameButton from '../AddGroupNameButton/AddGroupNameButton';
import EmptyTaskAddView from '../EmptyTaskAddView/EmptyTaskAddView';
import { onDragEndTask } from '../DragDrop.helpers';
import { TaskGroupsContainer } from '../styled';

const OpenedTasksView = ({
  openDrawer,
  createTaskGroupList,
  currentUser,
  toggleCompleteTask,
  storeAsCurrentTask,
  groupedTasks,
  groupList,
  toggleSingleTaskPriority,
  editGroupName,
  quickAddTask,
  deleteGroup,
  changeGroupsOrder,
  reorderTasksInGroup,
  reorderSubtasksForTask,
  reassignTasksToAnotherGroup,
  reassignTask,
  isFetchingData,
  updateDueDate,
  updateWorkflowStatus,
  defaultGroupName,
  dragAndDropDisabled,
  listNameVisible,
  isSearchApplied,
  areFiltersApplied,
  selectedTask,
  isMainListView,
  listUniqueKey,
}) => {
  const [tasks, updateTaskGroups] = useState(groupedTasks);
  const [draggedId, setDraggableId] = useState(null);

  useEffect(() => {
    updateTaskGroups(groupedTasks);
  }, [groupedTasks]);

  const renderEmptyState = () => {
    if (isSearchApplied) return <NoSearchResultsView />;

    if (areFiltersApplied) return <NoFilterResultsView />;

    if (quickAddTask) {
      if (isMainListView)
        return (
          <EmptyTaskAddView
            quickAddTask={groupName => quickAddTask(groupName, null, true)}
          />
        );

      return (
        <EmptyListViewWithQuickAddTask quickAddTask={quickAddTask}>
          This list has no tasks
        </EmptyListViewWithQuickAddTask>
      );
    }

    return <EmptyListView>This list has no tasks</EmptyListView>;
  };

  return (
    <ViewLoader isFetchingData={isFetchingData}>
      <TaskGroupsContainer>
        {!isEmpty(groupedTasks) ? (
          <>
            <DragDropContext
              onBeforeCapture={({ draggableId }) => {
                if (!dragAndDropDisabled) setDraggableId(draggableId);
              }}
              onDragEnd={eventBundle =>
                !dragAndDropDisabled &&
                onDragEndTask({
                  eventBundle,
                  groupList,
                  tasks,
                  reorderTasksInGroup,
                  reassignTasksToAnotherGroup,
                  updateTaskGroups,
                  setDraggableId,
                })
              }
            >
              {groupList?.map(
                ({ groupName, taskGroupIdentifier, groupType }, i) => (
                  <TasksGroup
                    key={i}
                    isDefaultGroup={groupType === TASKGROUP_DEFAULT_TYPE}
                    groupId={taskGroupIdentifier}
                    currentUser={currentUser}
                    groupName={
                      groupType !== TASKGROUP_DEFAULT_TYPE
                        ? groupName
                        : defaultGroupName
                    }
                    openDrawer={openDrawer}
                    storeAsCurrentTask={storeAsCurrentTask}
                    toggleTaskPriority={toggleSingleTaskPriority}
                    editGroupName={editGroupName}
                    quickAddTask={quickAddTask}
                    deleteGroup={deleteGroup}
                    moveGroupUp={() => changeGroupsOrder(i, i - 1)}
                    moveGroupDown={() => changeGroupsOrder(i, i + 1)}
                    changingGroupOrderDisabled={!changeGroupsOrder}
                    isFirstGroup={i === 0}
                    isLastGroup={i === groupList?.length - 1}
                    tasks={
                      tasks[
                        groupType !== TASKGROUP_DEFAULT_TYPE
                          ? taskGroupIdentifier
                          : TASKGROUP_DEFAULT_TYPE
                      ] || []
                    }
                    taskGroupIdentifier={taskGroupIdentifier}
                    reorderSubtasksForTask={reorderSubtasksForTask}
                    reassignTask={reassignTask}
                    draggedId={draggedId}
                    toggleCompleteTask={toggleCompleteTask}
                    updateDueDate={updateDueDate}
                    updateWorkflowStatus={updateWorkflowStatus}
                    dragAndDropDisabled={dragAndDropDisabled}
                    listNameVisible={listNameVisible}
                    isSearchApplied={isSearchApplied}
                    selectedTask={selectedTask}
                    listUniqueKey={listUniqueKey}
                  />
                ),
              )}
            </DragDropContext>
            {!!createTaskGroupList && !isSearchApplied && (
              <GroupNameSection
                onEnterClick={groupName => createTaskGroupList(groupName)}
                placeholder={messages.placeholder}
                closeOnEnter
              >
                <AddGroupNameButton />
              </GroupNameSection>
            )}
          </>
        ) : (
          renderEmptyState()
        )}
      </TaskGroupsContainer>
    </ViewLoader>
  );
};

export default OpenedTasksView;

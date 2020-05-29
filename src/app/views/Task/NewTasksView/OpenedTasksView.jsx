/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { isEmpty } from 'ramda';

import { TASKGROUP_DEFAULT_TYPE } from 'api/task-group-list-api';
import EmptyListImage from 'img/empty-list';
import { TaskGroupsContainer } from './styled';
import TasksGroup from './TasksGroup/TasksGroup';
import GroupNameSection from './GroupNameSection/GroupNameSection';
import messages from './AddGroupNameButton/messages';
import AddGroupNameButton from './AddGroupNameButton/AddGroupNameButton';
import EmptyTaskAddView from './EmptyTaskAddView/EmptyTaskAddView';
import TasksViewLoader from './TasksViewLoader/TasksViewLoader';
import { onDragEndTask } from './DragDrop.helpers';
import EmptyListResult from './EmptyListResult/EmptyListResult';
import { getRandomEmptySearchResultImage } from './EmptyListResult/helpers';

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
  openDeleteConfirmationModal,
  changeGroupsOrder,
  reorderTasksInGroup,
  reorderSubtasksForTask,
  reassignTasksToAnotherGroup,
  reassignTask,
  isFetchingData,
  members,
  updateDueDate,
  updateWorkflowStatus,
  defaultGroupName,
  dragAndDropDisabled,
  listNameVisible,
  isSearchApplied,
}) => {
  const [tasks, updateTaskGroups] = useState(groupedTasks);
  const [draggedId, setDraggableId] = useState(null);
  const [emptySearchResultImage] = useState(getRandomEmptySearchResultImage());

  useEffect(() => {
    updateTaskGroups(groupedTasks);
  }, [groupedTasks]);

  const renderEmptyState = () => {
    if (isSearchApplied)
      return (
        <EmptyListResult
          imageSrc={emptySearchResultImage}
          text="No results were found for your search"
        />
      );

    if (quickAddTask)
      return (
        <EmptyTaskAddView
          quickAddTask={groupName => quickAddTask(groupName, null, true)}
        />
      );

    return (
      <EmptyListResult
        imageSrc={EmptyListImage}
        text="This list has no tasks"
      />
    );
  };

  return (
    <TasksViewLoader isFetchingData={isFetchingData}>
      {!isEmpty(groupedTasks) ? (
        <TaskGroupsContainer>
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
                  deleteGroup={openDeleteConfirmationModal}
                  moveGroupUp={() => changeGroupsOrder(i, i - 1)}
                  moveGroupDown={() => changeGroupsOrder(i, i + 1)}
                  isFirstGroup={i === 0}
                  isLastGroup={i === groupList?.length - 1}
                  tasks={
                    tasks[
                      groupType !== TASKGROUP_DEFAULT_TYPE
                        ? taskGroupIdentifier
                        : TASKGROUP_DEFAULT_TYPE
                    ] || []
                  }
                  reorderSubtasksForTask={reorderSubtasksForTask}
                  reassignTask={reassignTask}
                  draggedId={draggedId}
                  toggleCompleteTask={toggleCompleteTask}
                  members={members}
                  updateDueDate={updateDueDate}
                  updateWorkflowStatus={updateWorkflowStatus}
                  dragAndDropDisabled={dragAndDropDisabled}
                  listNameVisible={listNameVisible}
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
        </TaskGroupsContainer>
      ) : (
        renderEmptyState()
      )}
    </TasksViewLoader>
  );
};

export default OpenedTasksView;

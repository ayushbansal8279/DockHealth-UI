import React from 'react';

import { TaskGroupsContainer } from './styled';
import TasksGroup from './TasksGroup/TasksGroup';

const CompletedTasksView = ({
  tasks,
  openDrawer,
  currentUser,
  markComplete,
  storeAsCurrentTask,
  // groupedTasks,
  // groupList,
  toggleSingleTaskPriority,
  // editGroupName,
  // quickAddTask,
  // openDeleteConfirmationModal,
  // changeGroupsOrder,
}) => {
  return (
    <>
      {tasks.length > 0 ? (
        <TaskGroupsContainer>
          <TasksGroup
            // isDefaultGroup={groupType === TASKGROUP_DEFAULT_TYPE}
            // groupId={taskGroupIdentifier}
            groupName="Completed"
            currentUser={currentUser}
            markComplete={markComplete}
            openDrawer={openDrawer}
            storeAsCurrentTask={storeAsCurrentTask}
            toggleTaskPriority={toggleSingleTaskPriority}
            // editGroupName={editGroupName}
            // quickAddTask={quickAddTask}
            // deleteGroup={openDeleteConfirmationModal}
            // moveGroupUp={() => changeGroupsOrder(i, i - 1)}
            // moveGroupDown={() => changeGroupsOrder(i, i + 1)}
            // isFirstGroup={i === 0}
            // isLastGroup={i === groupList?.length - 1}
            tasks={tasks}
            isCompletedGroup
          />
        </TaskGroupsContainer>
      ) : (
        <div>List is empty</div>
      )}
    </>
  );
};

export default CompletedTasksView;

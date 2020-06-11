import React, { useState } from 'react';
import ArrowIcon from 'img/arrow';
import FullViewIcon from 'img/full-view';
import FullViewActiveIcon from 'img/full-view-active';
import SlimViewIcon from 'img/slim-view';
import SlimViewActiveIcon from 'img/slim-view-active';
import Task from 'views/Task/NewTasksView/TaskItem/TaskItem';
import TaskListMembers from 'components/tasklist/TaskListMembers/TaskListMembers';
import QuickAddTaskInput from 'components/tasklist/QuickAddTaskInput/QuickAddTaskInput';

import {
  Arrow,
  Tasks,
  ListDetailsContainer,
  ListDetailsHeader,
  ListNameSection,
  ViewIcon,
} from './styled';

const FULL_VIEW = 'FULL_VIEW';
const SLIM_VIEW = 'SLIM_VIEW';

const TaskListDetailsDropdown = ({
  list,
  tasks,
  currentUser,
  selectedTask,
  openDrawer,
  storeAsCurrentTask,
  isCompleteTab,
  toggleTaskStatus,
  toggleTaskPriority,
  reassignTask,
  updateDueDate,
  updateWorkflowStatus,
  quickAddTask,
}) => {
  const [isOpen, switchOpen] = useState(true);
  const [viewType, setViewType] = useState(FULL_VIEW);
  const isFullView = viewType === FULL_VIEW;

  const { listName, taskListIdentifier, memberUsers, adminUsers } = list;

  const listMembers = [currentUser].concat(adminUsers).concat(memberUsers);

  return (
    <ListDetailsContainer>
      <ListDetailsHeader>
        <Arrow
          alt="arrow"
          isOpen={isOpen}
          onClick={() => switchOpen(!isOpen)}
          src={ArrowIcon}
        />
        <ListNameSection>{listName}</ListNameSection>
        {listMembers?.length > 0 && <TaskListMembers members={listMembers} />}
        <div>
          <ViewIcon
            alt="slim-view"
            src={isFullView ? SlimViewIcon : SlimViewActiveIcon}
            onClick={() => setViewType(SLIM_VIEW)}
            isHidden={!isOpen || tasks?.length === 0}
          />
          <ViewIcon
            alt="full-view"
            src={isFullView ? FullViewActiveIcon : FullViewIcon}
            onClick={() => setViewType(FULL_VIEW)}
            isHidden={!isOpen || tasks?.length === 0}
          />
        </div>
      </ListDetailsHeader>
      <Tasks timeout={150} in={isOpen}>
        {!isCompleteTab && (
          <QuickAddTaskInput
            quickAddTask={taskName =>
              quickAddTask(taskName, taskListIdentifier)
            }
          />
        )}
        <div>
          {tasks?.map(task => (
            <Task
              key={task.taskIdentifier}
              currentUser={currentUser}
              isFullView={isFullView}
              openDrawer={openDrawer}
              storeAsCurrentTask={storeAsCurrentTask}
              toggleTaskPriority={toggleTaskPriority}
              task={task}
              groupId={tasks.taskIdentifier}
              draggableProvided={{}}
              isCompletedGroup={isCompleteTab}
              toggleCompleteTask={toggleTaskStatus}
              reassignTask={reassignTask}
              updateDueDate={updateDueDate}
              updateWorkflowStatus={updateWorkflowStatus}
              dragAndDropDisabled
              selectedTask={selectedTask}
              patientVisible={false}
            />
          ))}
        </div>
      </Tasks>
    </ListDetailsContainer>
  );
};

export default TaskListDetailsDropdown;

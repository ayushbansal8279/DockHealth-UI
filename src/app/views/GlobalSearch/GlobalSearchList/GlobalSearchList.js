import React, { useState } from 'react';
import ArrowIcon from 'img/arrow';
import Spacing from 'components/common/Spacing';
import Task from 'components/task-item/StandardTaskItem/TaskItem';
import {
  Arrow,
  Tasks,
  ListDetailsContainer,
  ListDetailsHeader,
  ListNameSection,
  ListNameContainer,
} from 'components/tasklist/DropdownListSection/styled';

const GlobalSearchList = ({
  list,
  currentUser,
  selectedTask,
  openDrawer,
  storeAsCurrentTask,
  toggleTaskStatus,
  toggleTaskPriority,
  reassignTask,
  updateDueDate,
  updateWorkflowStatus,
}) => {
  const { listName, tasks } = list;

  const [isOpen, switchOpen] = useState(true);

  return (
    <ListDetailsContainer>
      <ListDetailsHeader>
        <ListNameContainer
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Arrow
            alt="arrow"
            isOpen={isOpen}
            onClick={() => switchOpen(!isOpen)}
            src={ArrowIcon}
          />
          <ListNameSection>
            {listName} ({tasks?.length || 0})
          </ListNameSection>
        </ListNameContainer>
      </ListDetailsHeader>
      <Tasks timeout={150} in={isOpen}>
        {tasks?.map(task => (
          <>
            <Task
              key={task.taskIdentifier}
              currentUser={currentUser}
              openDrawer={openDrawer}
              storeAsCurrentTask={storeAsCurrentTask}
              toggleTaskPriority={toggleTaskPriority}
              task={task}
              groupId={tasks.taskIdentifier}
              draggableProvided={{}}
              isCompletedGroup={false}
              toggleCompleteTask={toggleTaskStatus}
              reassignTask={reassignTask}
              updateDueDate={updateDueDate}
              updateWorkflowStatus={updateWorkflowStatus}
              dragAndDropDisabled
              selectedTask={selectedTask}
              taskContext="search"
              isFullView
            />
            <Spacing vertical={3} />
          </>
        ))}
      </Tasks>
    </ListDetailsContainer>
  );
};

export default GlobalSearchList;

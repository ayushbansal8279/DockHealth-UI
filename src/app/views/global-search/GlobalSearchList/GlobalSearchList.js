import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ArrowIcon from 'img/arrow';
import Spacing from 'components/common/Spacing';
import StandardTaskItem from 'components/task-item/StandardTaskItem/StandardTaskItem';
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
  highlightedValue,
  isCompletedList,
}) => {
  const { listName, tasks } = list;
  const [isOpen, switchOpen] = useState(true);
  const {
    addingNewSubtask,
    addingNewSubtaskParentId,
    subtaskShape,
  } = useSelector(state => ({
    addingNewSubtask: state.taskState.addingNewSubtask,
    addingNewSubtaskParentId: state.taskState.addingNewSubtaskParentId,
    subtaskShape: state.taskState.subtaskShape,
  }));

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
            <StandardTaskItem
              key={task.taskIdentifier}
              currentUser={currentUser}
              openDrawer={openDrawer}
              storeAsCurrentTask={storeAsCurrentTask}
              toggleTaskPriority={toggleTaskPriority}
              task={task}
              groupId={tasks.taskIdentifier}
              draggableProvided={{}}
              isCompletedGroup={isCompletedList}
              toggleCompleteTask={toggleTaskStatus}
              reassignTask={reassignTask}
              updateDueDate={updateDueDate}
              updateWorkflowStatus={updateWorkflowStatus}
              dragAndDropDisabled
              selectedTask={selectedTask}
              isFullView
              highlightedValue={highlightedValue}
              addingNewSubtask={addingNewSubtask}
              addingNewSubtaskParentId={addingNewSubtaskParentId}
              subtaskShape={subtaskShape}
            />
            <Spacing vertical={3} />
          </>
        ))}
      </Tasks>
    </ListDetailsContainer>
  );
};

export default GlobalSearchList;

import React from 'react';
import Subtask from '../Subtask/Subtask';
import SubtasksLoader from '../SubtasksLoader/SubtasksLoader';
import QuickAddSubtask from './QuickAddSubtask';
import { Container, Title } from './styled';

const SubtasksSection = ({
  subtasks,
  subTasksCount,
  currentUser,
  taskListIdentifier,
  onQuickAddSubtask,
}) => {
  return (
    <Container>
      <Title>Subtasks</Title>
      {subTasksCount > 0 && (!subtasks || subtasks.length === 0) ? (
        <SubtasksLoader rows={subTasksCount || 4} />
      ) : (
        <>
          {subtasks?.map(subtask => (
            <Subtask
              key={subtask.taskIdentifier}
              subtask={subtask}
              currentUser={currentUser}
            />
          ))}
        </>
      )}
      <QuickAddSubtask
        taskListIdentifier={taskListIdentifier}
        onQuickAddSubtask={onQuickAddSubtask}
      />
    </Container>
  );
};

export default SubtasksSection;

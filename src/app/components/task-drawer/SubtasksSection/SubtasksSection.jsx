import React from 'react';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { selectedTaskSelector } from 'selectors/task-drawer-selectors';
import DrawerTask from 'components/drawer-common/DrawerTask/DrawerTask';
import DrawerTaskLoader from 'components/drawer-common/DrawerTaskLoader/DrawerTaskLoader';
import { Container, Title } from './styled';
import QuickAddSubtask from '../QuickAddSubtask/QuickAddSubtask';

const SubtasksSection = () => {
  const currentUser = useSelector(userProfileSelector);
  const selectedTask = useSelector(selectedTaskSelector) || {};
  const tasks = selectedTask.subtasks;
  const tasksCount = selectedTask.subTasksCount;
  return (
    <Container>
      <Title>Subtasks</Title>
      {tasksCount > 0 && (!tasks || tasks.length === 0) ? (
        <DrawerTaskLoader rows={tasksCount || 4} />
      ) : (
        <>
          {tasks?.map(task => (
            <DrawerTask
              key={task.taskIdentifier}
              task={task}
              currentUser={currentUser}
            />
          ))}
        </>
      )}
      <QuickAddSubtask />
    </Container>
  );
};

export default SubtasksSection;

/* eslint-disable sonarjs/cognitive-complexity */
import React from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { taskDrawerOpenSelector } from 'selectors/task-drawer-selectors';
import TaskDrawerContent from 'components/task-drawer/TaskDrawerContent/TaskDrawerContent';
import AddTaskDrawerContent from '@/app/components/task-drawer/TaskDrawerContent/AddTaskDrawerContent';
import { AnimatedContainer } from './styled';

const TaskDrawer = (props) => {
  const { isAddTaskDrawer } = props;
  const taskDrawerOpen = useSelector(taskDrawerOpenSelector);

  return ReactDOM.createPortal(
    <AnimatedContainer
      style={{
        transform: taskDrawerOpen ? 'translateX(0%)' : 'translateX(100%)',
      }}
    >
      {isAddTaskDrawer ? (
        <AddTaskDrawerContent {...props} />
      ) : (
        <TaskDrawerContent {...props} stickyHeader origin={props.origin} />
      )}
    </AnimatedContainer>,
    document.body,
  );
};

export default React.memo(TaskDrawer);

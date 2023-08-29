/* eslint-disable sonarjs/cognitive-complexity */
import React from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { taskDrawerOpenSelector } from 'selectors/task-drawer-selectors';
// import { AnimatePresence } from 'framer-motion';
import TaskDrawerContent from 'components/task-drawer/TaskDrawerContent/TaskDrawerContent';
import { AnimatedContainer } from './styled';

const TaskDrawer = (props) => {
  const taskDrawerOpen = useSelector(taskDrawerOpenSelector);

  return ReactDOM.createPortal(
    // <AnimatePresence initial={false}>
    <AnimatedContainer
      style={{
        transform: taskDrawerOpen ? 'translateX(0%)' : 'translateX(100%)',
      }}
    >
      <TaskDrawerContent {...props} stickyHeader origin={props.origin} />
    </AnimatedContainer>,
    // </AnimatePresence>,
    document.body,
  );
};

export default React.memo(TaskDrawer);

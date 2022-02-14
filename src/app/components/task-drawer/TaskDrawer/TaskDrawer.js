/* eslint-disable sonarjs/cognitive-complexity */
import React from 'react';
import { useSelector } from 'react-redux';
import { taskDrawerOpenSelector } from 'selectors/task-drawer-selectors';
import { AnimatePresence } from 'framer-motion/dist/framer-motion';
import TaskDrawerContent from 'components/task-drawer/TaskDrawerContent/TaskDrawerContent';
import { AnimatedContainer } from './styled';

const TaskDrawer = props => {
  const taskDrawerOpen = useSelector(taskDrawerOpenSelector);

  return (
    <>
      <AnimatePresence initial={false}>
        {taskDrawerOpen && (
          <AnimatedContainer
            initial={{ translateX: '100%' }}
            animate={{ translateX: 0 }}
            exit={{ translateX: '100%' }}
            transition={{ duration: 0.3, bounce: 0 }}
          >
            <TaskDrawerContent {...props} />
          </AnimatedContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default React.memo(TaskDrawer);

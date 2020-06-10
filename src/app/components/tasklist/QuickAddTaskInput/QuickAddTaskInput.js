import React, { useRef } from 'react';
import { AddTaskInputWrapper } from './styled';

const QuickAddTaskInput = ({ quickAddTask }) => {
  const addTaskInput = useRef();

  const handleInputEnterDown = taskName => {
    if (taskName) {
      quickAddTask(taskName);
      addTaskInput.current.value = '';
    }
  };

  return (
    <AddTaskInputWrapper>
      <input
        name="newTask"
        type="text"
        ref={addTaskInput}
        placeholder="Add task"
        onKeyDown={event =>
          event.keyCode === 13 && handleInputEnterDown(event.target.value)
        }
      />
    </AddTaskInputWrapper>
  );
};

export default QuickAddTaskInput;

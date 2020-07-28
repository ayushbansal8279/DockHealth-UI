import React, { useRef, useState } from 'react';
import { AddTaskInputWrapper, ErrorLabel } from './styled';

const QuickAddTaskInput = ({
  quickAddTask,
  onFocus,
  validator,
  autoComplete = 'on',
}) => {
  const addTaskInput = useRef();
  const [error, setError] = useState(null);

  const handleInputEnterDown = taskName => {
    let validatorError = null;

    if (validator) {
      validatorError = validator(taskName);
      setError(validatorError);
    }

    if (taskName && !validatorError) {
      quickAddTask(taskName);
      addTaskInput.current.value = '';

      if (validator) {
        setError(null);
      }
    }
  };

  return (
    <>
      <AddTaskInputWrapper hasError={!!error}>
        <input
          autoComplete={autoComplete}
          name="newTask"
          type="text"
          ref={addTaskInput}
          placeholder="Add a task and press enter on your keyboard"
          onFocus={onFocus}
          onKeyDown={event =>
            event.keyCode === 13 && handleInputEnterDown(event.target.value)
          }
        />
      </AddTaskInputWrapper>
      {error && <ErrorLabel>{error}</ErrorLabel>}
    </>
  );
};

export default QuickAddTaskInput;

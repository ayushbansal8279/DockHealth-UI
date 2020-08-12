import React, { useState } from 'react';
import { AddTaskInputWrapper, ErrorLabel } from './styled';

const QuickAddTaskInput = ({
  quickAddTask,
  onFocus,
  validator,
  autoComplete = 'on',
}) => {
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const handleInputEnterDown = () => {
    let validatorError = null;

    if (validator) {
      validatorError = validator(inputValue);
      setError(validatorError);
    }

    if (inputValue && !validatorError) {
      quickAddTask(inputValue);
      setInputValue('');

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
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          placeholder="Add a task and press enter on your keyboard"
          onFocus={onFocus}
          onKeyDown={event => event.keyCode === 13 && handleInputEnterDown()}
        />
        {inputValue && <span>Press enter to save this task</span>}
      </AddTaskInputWrapper>
      {error && <ErrorLabel>{error}</ErrorLabel>}
    </>
  );
};

export default QuickAddTaskInput;

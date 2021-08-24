import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTaskToTemplate } from 'actions/task-template-actions';
import { getTargetNodeType } from 'helpers/task-template-builder-helpers';
import TaskNodeWrapper from '../TaskNodeWrapper/TaskNodeWrapper';
import { NewTaskInput } from './styled';

const NewTaskNode = React.memo(props => {
  const { id, type, data, selected, xPos, yPos } = props;

  const { taskTemplateIdentifier } = data;
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();

  const clearInput = () => setInputValue('');

  const addTask = description => {
    dispatch(
      addTaskToTemplate(
        {
          description,
          taskTemplateIdentifier,
          intentType: getTargetNodeType(type),
        },
        id,
        { x: xPos, y: yPos },
      ),
    );
  };

  const handleInputChange = event => setInputValue(event.target.value);

  const handleKeyDown = event => {
    const { key } = event;

    switch (key) {
      case 'Enter':
        if (inputValue?.length > 2) {
          addTask(inputValue);
        }
        break;
      case 'Escape':
        clearInput();
        break;
      default:
        break;
    }
  };

  return (
    <TaskNodeWrapper selected={selected} type={type}>
      <NewTaskInput
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Add Task Description"
      />
    </TaskNodeWrapper>
  );
});

export default NewTaskNode;

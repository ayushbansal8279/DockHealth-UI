import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  addTaskToTemplate,
  deleteTemporaryElement,
} from 'actions/task-template-actions';
import { getTargetNodeType } from 'helpers/smart-flow-builder-helpers';
import TaskNodeWrapper from '../TaskNodeWrapper/TaskNodeWrapper';
import { NewTaskInput, NewTaskWrapper } from './styled';
import TaskNodeHandles from '../TaskNodeHandles/TaskNodeHandles';

const NewTaskNode = React.memo(props => {
  const { id, type, data, selected, xPos, yPos, isConnectable } = props;

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
        if (inputValue?.length > 0) {
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

  const handleBlur = () => {
    if (inputValue?.length > 0) {
      addTask(inputValue);
    }
  };

  return (
    <TaskNodeHandles
      isConnectable={isConnectable}
      isConnecting={data.draggedEdgeSourceId}
      onTargetHandleHover={data.onTargetHandleHover}
    >
      <TaskNodeWrapper selected={selected} type={type}>
        <NewTaskWrapper>
          <NewTaskInput
            value={inputValue}
            placeholder="Add Task Description"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
          <IconButton onClick={() => dispatch(deleteTemporaryElement(id))}>
            <DeleteIcon />
          </IconButton>
        </NewTaskWrapper>
      </TaskNodeWrapper>
    </TaskNodeHandles>
  );
});

export default NewTaskNode;

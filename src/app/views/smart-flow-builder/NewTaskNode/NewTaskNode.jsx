import React, { useState } from 'react';
import { Fab, IconButton } from '@mui/material';
import { AccountTree as DecisionIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import DecisionTaskElementIcon from 'img/template/decision-task-icon';
import {
  addTaskToTemplate,
  deleteTemporaryElement,
} from 'actions/task-template-actions';
import {
  getTargetNodeType,
  NodeType,
} from 'helpers/smart-flow-builder-helpers';
import TaskNodeWrapper from '../TaskNodeWrapper/TaskNodeWrapper';
import { NewTaskInput, NewTaskWrapper } from './styled';
import TaskNodeHandles from '../TaskNodeHandles/TaskNodeHandles';
import BaseNode from '../BaseNode/BaseNode';
import { DecisionTaskIconWrapper } from '../TaskNode/styled';
import { TaskElementIcon } from '../styled';

const NewTaskNode = React.memo((props) => {
  const {
    id,
    type,
    data,
    selected,
    positionAbsoluteX,
    positionAbsoluteY,
    isConnectable,
  } = props;

  const { taskTemplateIdentifier } = data;
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();

  const clearInput = () => setInputValue('');

  const addTask = (description) => {
    if (type === 'NEW_AUTOMATION') {
      description = '[System] ' + description;
    }
    dispatch(
      addTaskToTemplate(
        {
          description,
          taskTemplateIdentifier,
          intentType: getTargetNodeType(type),
        },
        id,
        { x: positionAbsoluteX, y: positionAbsoluteY },
      ),
    );
  };

  const handleInputChange = (event) => setInputValue(event.target.value);

  const handleKeyDown = (event) => {
    const { key } = event;

    switch (key) {
      case 'Enter': {
        if (inputValue?.length > 0) {
          addTask(inputValue);
        }
        break;
      }
      case 'Escape': {
        clearInput();
        break;
      }
      default: {
        break;
      }
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
      draggedEdgeSourceId={data?.draggedEdgeSourceId}
    >
      <BaseNode
        selected={selected}
        type={type}
        optionButtons={[
          <Fab
            key="delete"
            aria-label="delete"
            size="small"
            onClick={() => dispatch(deleteTemporaryElement(id))}
          >
            <DeleteIcon fontSize="small" color="inherit" />
          </Fab>,
        ]}
        headerIcon={
          <>
            {type === NodeType.NEW_DECISION && (
              <DecisionIcon fontSize="small" />
            )}
            {type === NodeType.NEW_STANDARD && <TaskElementIcon />}
          </>
        }
        headerTitle={'Task'}
        content={
          <NewTaskWrapper>
            <NewTaskInput
              value={inputValue}
              placeholder="Add Task Description"
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
            />
          </NewTaskWrapper>
        }
      />
    </TaskNodeHandles>
  );
});

export default NewTaskNode;

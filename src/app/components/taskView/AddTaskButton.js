import ButtonBase from '@material-ui/core/ButtonBase';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import AddTaskCrossIcon from '../../img/add-task-cross.svg';

const AddTaskButtonContainer = styled.div`
  align-items: center;
  display: flex;
  height: 64px;
  justify-content: center;
  position: absolute;
  right: 24px;
  top: 0;
  transition: width 0.25s ease-out;
  width: ${props => (props.addingNewTask ? 44 : 160)}px;
  z-index: 2;
`;

const AddTaskButton = styled(ButtonBase)`
  && {
    align-items: center;
    background-color: #d9036b;
    border-radius: 22px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    color: #fff;
    cursor: pointer;
    display: flex;
    justify-content: center;
    height: 44px;
    width: 100%;
  }
`;

const AddTaskButtonImage = styled.img`
  margin-right: 10px;
  transition: all 0.25s ease-out;
  transform: rotate(0deg);

  ${props =>
    props.addingNewTask &&
    `
    margin-right: 0;
    transform: rotate(45deg);
  `}
`;

const AddTaskButtonLabel = styled.span`
  font-size: 20px;
  overflow: hidden;
  text-overflow: clip;
  transition: all 0.25s ease-out;
  white-space: nowrap;
  ${props =>
    props.width && `width: ${props.addingNewTask ? 0 : props.width}px`};
`;

export default ({ addingNewTask, onClick }) => {
  const [addTaskLabelWidth, setAddTaskLabelWidth] = useState(null);
  const addTaskLabel = useRef(null);

  useEffect(() => {
    setAddTaskLabelWidth(addTaskLabel.current.scrollWidth);
  }, []);

  return (
    <AddTaskButtonContainer addingNewTask={addingNewTask}>
      <AddTaskButton onClick={onClick} variant="contained">
        <AddTaskButtonImage
          addingNewTask={addingNewTask}
          src={AddTaskCrossIcon}
        />
        <AddTaskButtonLabel
          addingNewTask={addingNewTask}
          width={addTaskLabelWidth}
          ref={addTaskLabel}
        >
          Add a task
        </AddTaskButtonLabel>
      </AddTaskButton>
    </AddTaskButtonContainer>
  );
};

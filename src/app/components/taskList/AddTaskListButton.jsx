import { ButtonBase } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import AddTaskCrossIcon from '../../img/add-task-cross.svg';

const AddTaskListButtonContainer = styled.div`
  align-items: center;
  display: flex;
  height: 64px;
  justify-content: center;
  margin-right: 2em;
  transition: width 0.25s ease-out;
  width: ${props => (props.addingNewTask ? 44 : 160)}px;
  z-index: 2;
`;

const AddTaskListButton = styled(ButtonBase)`
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

const AddTaskListButtonImage = styled.img`
  margin-right: 10px;
  transition: all 0.25s ease-out;
  transform: rotate(0deg);

  ${props =>
    props.addingNew &&
    `
    margin-right: 0;
    transform: rotate(45deg);
  `}
`;

const AddTaskListButtonLabel = styled.span`
  font-size: 1.25rem;
  overflow: hidden;
  text-overflow: clip;
  transition: all 0.25s ease-out;
  white-space: nowrap;
  ${props => props.width && `width: ${props.addingNew ? 0 : props.width}px`};
`;

export default ({ addingNew, onClick }) => {
  const [addTaskLabelWidth, setAddTaskLabelWidth] = useState(null);
  const addTaskLabel = useRef(null);

  useEffect(() => {
    setAddTaskLabelWidth(addTaskLabel.current.scrollWidth);
  }, []);

  return (
    <AddTaskListButtonContainer addingNew={addingNew}>
      <AddTaskListButton onClick={onClick} variant="contained">
        <AddTaskListButtonImage addingNew={addingNew} src={AddTaskCrossIcon} />
        <AddTaskListButtonLabel
          addingNew={addingNew}
          width={addTaskLabelWidth}
          ref={addTaskLabel}
        >
          &nbsp;Add a list&nbsp;
        </AddTaskListButtonLabel>
      </AddTaskListButton>
    </AddTaskListButtonContainer>
  );
};

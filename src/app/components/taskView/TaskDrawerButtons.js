import ButtonBase from '@material-ui/core/ButtonBase';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import AddTaskCrossIcon from '../../img/add-task-cross.svg';

// const AddTaskButtonBase = styled(ButtonBase)`
const AddTaskButtonBase = styled(({ padded, circle, ...props }) => <ButtonBase {...props} />)`
  && {
    align-items: center;
    background-color: #d9036b;
    border-radius: 22px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    color: #fff;
    cursor: pointer;
    display: flex;
    justify-content: center;
    height: 2.5rem;

    ${props => props.padded && 'padding: 0 1rem;'}
    ${props => props.circle && 'width: 2.5rem;'}
  }
`;

const AddTaskButtonImage = styled.img`
  ${props =>
    props.rotated ? 'transform: rotate(45deg);' : 'margin-right: 10px;'}
`;

const AddTaskButtonLabel = styled.span`
  font-size: 1.25rem;
  transition: all 0.25s ease-out;
`;

export const AddTaskButton = ({ onClick }) => {
  const [addTaskLabelWidth, setAddTaskLabelWidth] = useState(null);
  const addTaskLabel = useRef(null);

  useEffect(() => {
    setAddTaskLabelWidth(addTaskLabel.current.scrollWidth);
  }, []);

  return (
    <AddTaskButtonBase padded onClick={onClick} variant="contained">
      <AddTaskButtonImage src={AddTaskCrossIcon} />
      <AddTaskButtonLabel width={addTaskLabelWidth} ref={addTaskLabel}>
        Add a task
      </AddTaskButtonLabel>
    </AddTaskButtonBase>
  );
};

export const CloseTaskButton = ({ onClick }) => {
  return (
    <AddTaskButtonBase circle onClick={onClick} variant="contained">
      <AddTaskButtonImage rotated src={AddTaskCrossIcon} />
    </AddTaskButtonBase>
  );
};

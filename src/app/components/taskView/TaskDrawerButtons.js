import ButtonBase from '@material-ui/core/ButtonBase';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import AddTaskCrossIcon from '../../img/add-task-cross.svg';

const AddTaskButtonBase = styled(
  ({ padded, paddedSmall, circle, ...props }) => <ButtonBase {...props} />,
)`
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
    ${props => props.paddedSmall && 'margin: 0.5rem 0 0;'}
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
    <AddTaskButtonBase
      padded
      onClick={onClick}
      variant="contained"
      data-name="addTaskButton"
    >
      <AddTaskButtonImage src={AddTaskCrossIcon} />
      <AddTaskButtonLabel width={addTaskLabelWidth} ref={addTaskLabel}>
        Add a task
      </AddTaskButtonLabel>
    </AddTaskButtonBase>
  );
};

export const CloseTaskButton = ({ onClick, paddedSmall }) => {
  return (
    <AddTaskButtonBase
      paddedSmall={paddedSmall}
      circle
      onClick={onClick}
      variant="contained"
    >
      <AddTaskButtonImage
        paddedSmall={paddedSmall}
        rotated
        src={AddTaskCrossIcon}
      />
    </AddTaskButtonBase>
  );
};

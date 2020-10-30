import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { prepareSubtask } from 'actions/task-actions';
import palette from 'styles/palette';

export const AddSubtaskContainer = styled.div`
  align-items: center;
  background-color: ${palette.white};
  display: flex;
  justify-content: flex-start;
  padding: 8px;
  padding-left: ${props => (props.padded ? 'calc(53px - 1ch)' : 0)};
  padding-top: 6px;

  > span {
    color: ${props =>
      props.disabled ? palette.unknownGrey5 : palette.lighterCyanBlue};
    cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
    transition: filter 0.25s linear;

    &:hover {
      ${props => !props.disabled && 'filter: brightness(1.25);'}
    }
  }
`;

const AddSubtask = ({ padded, taskIdentifier, parentTask }) => {
  const dispatch = useDispatch();
  const addingNewSubtask = useSelector(
    state => state.taskState.addingNewSubtask,
  );

  return (
    <AddSubtaskContainer disabled={addingNewSubtask} padded={padded}>
      <span
        onClick={event => {
          event.preventDefault();
          event.stopPropagation();
          if (!addingNewSubtask) {
            prepareSubtask(taskIdentifier, null, parentTask)(dispatch);
          }
        }}
      >
        + add a subtask
      </span>
    </AddSubtaskContainer>
  );
};

export default AddSubtask;

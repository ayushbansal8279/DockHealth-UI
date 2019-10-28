import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { addSubtask } from '../../actions/task-actions';

export const AddSubtaskContainer = styled.div`
  align-items: center;
  background-color: #fff;
  display: flex;
  justify-content: flex-start;
  padding: 8px;
  padding-left: 53px;
  padding-top: 6px;

  > span {
    color: ${props => (props.disabled ? '#ababb2' : '#0ca1c7')};
    cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
    transition: filter 0.25s linear;

    &:hover {
      ${props => !props.disabled && 'filter: brightness(1.25);'}
    }
  }
`;

const AddSubtask = ({ disabled, taskId }) => {
  const dispatch = useDispatch();
  const addingNewSubtask = useSelector(
    state => state.taskState.addingNewSubtask,
  );

  const addingDisabled = disabled || addingNewSubtask;

  return (
    <AddSubtaskContainer disabled={addingDisabled}>
      <span
        onClick={addingDisabled ? () => {} : () => addSubtask(taskId)(dispatch)}
      >
        {addingDisabled ? 'adding a subtask...' : '+ add a subtask'}
      </span>
    </AddSubtaskContainer>
  );
};

AddSubtask.propTypes = {
  disabled: PropTypes.bool,
};

AddSubtask.defaultProps = {
  disabled: false,
};

export default AddSubtask;

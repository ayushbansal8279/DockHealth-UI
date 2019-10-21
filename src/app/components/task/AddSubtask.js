import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ButtonBase from '@material-ui/core/ButtonBase';
import AddIcon from '@material-ui/icons/Add';
import { addSubtask } from '../../actions/task-actions';

const AddSubtaskContainer = styled(ButtonBase).attrs({
  disableRipple: true,
})`
  && {
    padding: 8px;
    margin-left: -8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
  }
`;

const AddButton = styled.div`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 19px;
    height: 19px;
    border-radius: 50%;
    background: #0ca1c7;
    color: #fff;
    font-weight: bold;
  }
`;

const StyledAddIcon = styled(AddIcon)`
  && {
    width: 17px;
    height: 17px;
  }
`;

const AddLabel = styled.div`
  margin-left: 4px;
  color: #0ca1c7;
  font-size: 14px;
  line-height: 16px;
`;

const AddSubtask = ({ onClick, disabled }) => (
  <AddSubtaskContainer onClick={onClick} disabled={disabled}>
    <AddButton>
      <StyledAddIcon />
    </AddButton>
    <AddLabel>Add a subtask</AddLabel>
  </AddSubtaskContainer>
);

AddSubtask.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

AddSubtask.defaultProps = {
  disabled: false,
};

const mapDispatchToProps = (dispatch, { taskId }) => ({
  onClick: () => {
    addSubtask(taskId)(dispatch);
  },
});

const ConnectedAddSubtask = connect(
  undefined,
  mapDispatchToProps,
)(AddSubtask);

export default ConnectedAddSubtask;

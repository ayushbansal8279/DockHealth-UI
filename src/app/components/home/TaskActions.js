import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ButtonBase from '@material-ui/core/ButtonBase';
import { deleteTask, duplicateTask } from '../../actions/task-actions';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const ActionButton = styled(ButtonBase)`
  && {
    font-size: 14px;
    color: #13a7d1;
    padding: 8px;
    border-radius: 4px;
  }
`;

const Divider = styled.div`
  ::before {
    content: " | ";
    color: #a9b8c5;
    font-size: 14px;
    line-height: 28px;
  }
`;

const TaskActions = ({ remove, duplicate }) => (
  <Container>
    <ActionButton onClick={remove}>Delete</ActionButton>
    <Divider />
    <ActionButton onClick={duplicate}>Duplicate</ActionButton>
  </Container>
);

TaskActions.propTypes = {
  remove: PropTypes.func.isRequired,
  duplicate: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, { taskId }) => ({
  remove: () => deleteTask({ taskId })(dispatch),
  duplicate: () => duplicateTask({ taskId })(dispatch),
});

const ConnectedTaskActions = connect(undefined, mapDispatchToProps)(TaskActions);

ConnectedTaskActions.propTypes = {
  taskId: PropTypes.number.isRequired,
};

export default ConnectedTaskActions;

import { ButtonBase } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { updateReminder } from '../../actions/task-actions';
import DateTimeSelect from './DateTimeSelect';
import DueDate from './DueDate';

const StyledButtonBase = styled(ButtonBase)`
  && {
    padding: 8px;
    margin-left: -8px;
    border-radius: 4px;
  }
`;

const Placeholder = styled.div`
  font-size: 14px;
  font-style: italic;
  color: #aab8c3;
`;

const Reminder = ({ children, update, completed }) => (
  <DateTimeSelect value={children} onChange={update} label="Select a reminder">
    {({ open }) => (
      <StyledButtonBase onClick={open} disabled={completed}>
        {children ? (
          <DueDate completed={completed}>{children}</DueDate>
        ) : (
          <Placeholder>Set a reminder</Placeholder>
        )}
      </StyledButtonBase>
    )}
  </DateTimeSelect>
);

Reminder.propTypes = {
  completed: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

Reminder.defaultProps = {
  children: null,
};

const mapDispatchToProps = (dispatch, { task }) => ({
  update: reminder => {
    updateReminder(task, reminder)(dispatch);
  },
});

export default connect(undefined, mapDispatchToProps)(Reminder);

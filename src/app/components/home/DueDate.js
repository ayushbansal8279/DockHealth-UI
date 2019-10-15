import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Moment from 'react-moment';
import moment from 'moment';

const Overdue = styled.span`
  color: #f40707;
`;

const DueDate = ({ children, completed }) => {
  if (children === null) {
    return null;
  }

  const now = moment();
  const due = moment(children);

  if (!completed) {
    if (due.isSame(now, 'day')) {
      return <Overdue>Today! <Moment format="@ h:mma">{due}</Moment></Overdue>;
    }

    if (due < now) {
      return <Overdue><Moment fromNow>{due}</Moment></Overdue>;
    }
  }

  return <Moment format="ddd, MMM D @ h:mma">{due}</Moment>;
};

DueDate.propTypes = {
  children: PropTypes.string,
  completed: PropTypes.bool,
};

DueDate.defaultProps = {
  children: null,
  completed: false,
};

export default DueDate;

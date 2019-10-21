import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import momentPropTypes from 'react-moment-proptypes';

const DateLabel = styled.div`
  margin-top: 12px;
  font-size: 10px;
  color: #aab8c3;
`;

const Day = ({ date, children }) => {
  const currentYear = moment().year();
  const isCurrentYear = d => d.year() === currentYear;
  const formatDate = d => d.format(isCurrentYear(d) ? 'dddd, MMMM Do' : 'dddd, MMMM Do, YYYY');

  return (
    <div>
      <DateLabel>{formatDate(date)}</DateLabel>
      {children}
    </div>);
};

Day.propTypes = {
  date: momentPropTypes.momentObj.isRequired,
};

export default Day;

import React, { useEffect, useState, useCallback } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import moment from 'moment';

const TaskItemElapsedTime = ({ task }) => {
  const { createdDateTime, completedDt: completedDate } = task || {};
  const [elapsedTime, setElapsedTime] = useState('');

  // eslint-disable-next-line consistent-return
  const calculateElapsedTime = useCallback(() => {
    if (!createdDateTime) {
      return '';
    }
    const createdDate = moment(createdDateTime);
    let endDate = moment();
    if (completedDate) {
      endDate = moment(completedDate);
    }
    const days = endDate.diff(createdDate, 'days');
    if (days <= 0) {
      const hours = endDate.diff(createdDate, 'hours');
      if (hours <= 0) {
        const minutes = endDate.diff(createdDate, 'minutes');
        setElapsedTime(`${minutes} min`);
        // eslint-disable-next-line consistent-return
        return;
      }
      setElapsedTime(`${hours} hr`);
      // eslint-disable-next-line consistent-return
      return;
    }
    setElapsedTime(`${days} d`);
  }, [createdDateTime, completedDate]);

  useEffect(() => {
    const token = setInterval(calculateElapsedTime, 10000);
    return () => {
      clearInterval(token);
    };
  }, [createdDateTime, completedDate, calculateElapsedTime]);

  return (
    <Tooltip placement="top" title="Date Completed">
      <>{elapsedTime ? <>{elapsedTime}</> : <></>}</>
    </Tooltip>
  );
};

export default TaskItemElapsedTime;

import React, { useMemo } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import moment from 'moment';

const TaskItemElapsedTime = ({ task }) => {
  const { createdDateTime, completedDt: completedDate } = task || {};

  const elapsedTime = useMemo(() => {
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
        return `${minutes} min`;
      }
      return `${hours} hr`;
    }
    return `${days} d`;
  }, [completedDate, createdDateTime]);

  return (
    <Tooltip placement="top" title="Date Completed">
      <>{elapsedTime ? <>{elapsedTime}</> : <></>}</>
    </Tooltip>
  );
};

export default TaskItemElapsedTime;

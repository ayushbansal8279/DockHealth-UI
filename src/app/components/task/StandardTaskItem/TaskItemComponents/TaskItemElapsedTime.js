import React, { useMemo } from 'react';
import Tooltip from 'components/common/Tooltip/Tooltip';
import moment from 'moment';

const TaskItemElapsedTime = ({ task }) => {
  const { createdDateTime, completedDt: completedDate } = task || {};

  const DATE_ISO_FORMAT = 'YYYY-MM-DD';

  const elapsedTime = useMemo(() => {
    const createdDate = moment(createdDateTime, DATE_ISO_FORMAT);
    let endDate = moment();
    if (completedDate) {
      endDate = moment(completedDate, DATE_ISO_FORMAT);
    }
    const days = endDate.diff(createdDate, 'days');
    if (days <= 0) {
      const hours = endDate.diff(createdDate, 'hours');
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

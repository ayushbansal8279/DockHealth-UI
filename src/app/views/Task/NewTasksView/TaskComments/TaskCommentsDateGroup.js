import React from 'react';
import moment from 'moment';
import TaskComment from './TaskComment';
import { TaskCommentsDate } from './styled';

const TaskCommentsDateGroup = ({
  groupDate,
  commentsGroup,
  onClickComment,
}) => {
  let groupdDateLabel = null;
  if (moment(groupDate).isSame(moment().startOf('day'))) {
    groupdDateLabel = 'Today';
  } else if (
    moment(groupDate).isSame(
      moment()
        .subtract(1, 'days')
        .startOf('day'),
    )
  ) {
    groupdDateLabel = 'Yesterday';
  } else {
    groupdDateLabel = moment(groupDate).format('MMM DD');
  }

  return (
    <div>
      <TaskCommentsDate>{groupdDateLabel}</TaskCommentsDate>
      {commentsGroup?.map((comment, index) => (
        <TaskComment
          {...comment}
          onClickComment={onClickComment}
          isOneByOne={
            commentsGroup[index - 1] &&
            commentsGroup[index - 1]?.creator?.userIdentifier ===
              comment?.creator?.userIdentifier
          }
        />
      ))}
    </div>
  );
};

export default TaskCommentsDateGroup;

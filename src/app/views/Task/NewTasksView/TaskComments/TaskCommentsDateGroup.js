import React from 'react';
import TaskComment from './TaskComment';

const TaskCommentsDateGroup = ({ commentsGroup, onClickComment }) => (
  <>
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
  </>
);

export default TaskCommentsDateGroup;

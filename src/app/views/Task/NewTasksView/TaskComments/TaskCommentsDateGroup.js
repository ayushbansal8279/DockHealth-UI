import React from 'react';
import TaskComment from './TaskComment';

const TaskCommentsDateGroup = ({
  commentsGroup,
  onClickComment,
  highlightedValue,
}) => (
  <>
    {commentsGroup?.map((comment, index) => (
      <TaskComment
        {...comment}
        highlightedValue={highlightedValue}
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

import React, { useState } from 'react';
import { ShowMoreButton, TaskCommentsContainer } from './styled';
import TaskComment from './TaskComment';

const TaskComments = ({
  isOpen,
  comments,
  onClickComment,
  highlightedValue,
}) => {
  const [showMore, setShowMore] = useState(
    !!(comments !== undefined && comments?.length > 3),
  );
  const limitedComments = !showMore ? comments : comments?.slice(0, 3);

  return (
    <TaskCommentsContainer timeout={150} in={isOpen}>
      {limitedComments?.map((comment, index) => (
        <TaskComment
          {...comment}
          key={index}
          highlightedValue={highlightedValue}
          onClickComment={onClickComment}
        />
      ))}
      {showMore && (
        <ShowMoreButton onClick={() => setShowMore(false)}>
          Show more
        </ShowMoreButton>
      )}
    </TaskCommentsContainer>
  );
};

export default TaskComments;

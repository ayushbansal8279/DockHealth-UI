import React, { useState } from 'react';
import moment from 'moment';
import { groupBy } from 'ramda';
import { ShowMoreButton, TaskCommentsContainer } from './styled';
import TaskCommentsDateGroup from './TaskCommentsDateGroup';

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
  const groupedComments = groupBy(
    ({ dateCreated }) => moment(dateCreated).format('M/DD/YYYY'),
    limitedComments ?? [],
  );

  return (
    <TaskCommentsContainer timeout={150} in={isOpen}>
      {Object.keys(groupedComments).map(key => (
        <TaskCommentsDateGroup
          key={key}
          groupDate={key}
          highlightedValue={highlightedValue}
          commentsGroup={groupedComments[key]}
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

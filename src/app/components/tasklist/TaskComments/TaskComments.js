import React, { useState } from 'react';
import moment from 'moment';
import { groupBy } from 'ramda';
import { getTaskDateLabel } from './helpers';
import {
  ShowMoreButton,
  TaskCommentsContainer,
  TaskGroupDateLabel,
} from './styled';
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
  const groupedComments = groupBy(
    ({ dateCreated }) => moment(dateCreated).format('M/DD/YYYY'),
    limitedComments ?? [],
  );
  return (
    <TaskCommentsContainer timeout={150} in={isOpen}>
      {Object.keys(groupedComments).map(key => (
        <div key={key}>
          <TaskGroupDateLabel>{getTaskDateLabel(key)}</TaskGroupDateLabel>
          <div onClick={onClickComment}>
            {groupedComments[key]?.map(comment => (
              <TaskComment
                key={comment.commentId}
                highlightedValue={highlightedValue}
                onClickComment={onClickComment}
                {...comment}
              />
            ))}
          </div>
        </div>
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

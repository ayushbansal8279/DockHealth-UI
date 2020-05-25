import React, { useState } from 'react';
import moment from 'moment';
import { groupBy } from 'ramda';
import {
  ShowMoreButton,
  TaskCommentsContainer,
  TaskCommentsDate,
  TaskCommentsGroupedDay,
} from './styled';
import TaskComment from './TaskComment';

const TaskComments = ({ isOpen, comments }) => {
  const [showMore, setShowMore] = useState(comments?.length <= 3);
  const limitedComments = showMore ? comments : comments?.slice(0, 3);
  const groupedComments = groupBy(
    ({ dateCreated }) => moment(dateCreated).format('M/DD/YYYY'),
    limitedComments ?? [],
  );

  return (
    <TaskCommentsContainer timeout={150} in={isOpen}>
      {Object.keys(groupedComments).map(key => (
        <TaskCommentsGroupedDay key={key}>
          <TaskCommentsDate>{key}</TaskCommentsDate>
          <div>
            {groupedComments[key]?.map(comment => (
              <TaskComment key={comment.commentId} {...comment} />
            ))}
          </div>
        </TaskCommentsGroupedDay>
      ))}
      {!showMore && (
        <ShowMoreButton onClick={() => setShowMore(true)}>
          Show more
        </ShowMoreButton>
      )}
    </TaskCommentsContainer>
  );
};

export default TaskComments;

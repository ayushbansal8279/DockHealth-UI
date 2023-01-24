import React, { useState } from 'react';
import StickyContainer from 'components/common/HorizontalScroll/StickyContainer';
import { Collapse } from '@material-ui/core';
import {
  ShowMoreButton,
  CommentStylingLink,
  TaskCommentsPadding,
} from './styled';
import TaskComment from './TaskComment';

const TaskComments = ({
  isOpen,
  comments,
  onClickComment,
  highlightedValue,
  isLast,
  showSubtaskStylingLink,
}) => {
  const [showMore, setShowMore] = useState(
    !!(comments !== undefined && comments?.length > 3),
  );
  const limitedComments = !showMore ? comments : comments?.slice(0, 3);

  return (
    <StickyContainer left={24} decreaseWidth={2 * 24}>
      <Collapse timeout={150} in={isOpen} islast={isLast}>
        <TaskCommentsPadding>
          {!isLast && showSubtaskStylingLink && <CommentStylingLink />}
          {limitedComments?.map((comment, index) => (
            <TaskComment
              {...comment}
              key={comment?.identifier || index}
              highlightedValue={highlightedValue}
              onClickComment={onClickComment}
              showMore={showMore}
              isLastComment={index === limitedComments?.length - 1}
            />
          ))}
          {showMore && (
            <ShowMoreButton onClick={() => setShowMore(false)}>
              Show more
            </ShowMoreButton>
          )}
        </TaskCommentsPadding>
      </Collapse>
    </StickyContainer>
  );
};

export default TaskComments;

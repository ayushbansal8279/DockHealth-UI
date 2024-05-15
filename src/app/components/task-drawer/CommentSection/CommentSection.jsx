import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCommentIdentifierToScroll } from 'actions/task-drawer-actions';
import Comment from 'components/drawer-common/Comment/Comment';
import {
  getCommentIdToScroll,
  scrollToByQuerySelector,
} from 'helpers/scroll-helper';
import { initializeCommentSectionHooks } from './helpers';
import {
  CommentSectionContainer,
  CommentsListContainer,
  Title,
} from './styled';

const CommentSection = ({ selectedTask }) => {
  const dispatch = useDispatch();
  const { comments, currentUser, removeComment, updateComment } =
    initializeCommentSectionHooks(selectedTask);
  const { commentIdentifierToScroll } = useSelector(
    (state) => state.taskDrawerState,
  );

  useEffect(() => {
    scrollToByQuerySelector(
      `#${getCommentIdToScroll(commentIdentifierToScroll)}`,
    );
    dispatch(setCommentIdentifierToScroll(null));
  }, [dispatch, commentIdentifierToScroll]);

  return (
    <CommentSectionContainer>
      <Title>Comments</Title>
      <CommentsListContainer>
        {comments?.map((comment) => (
          <Comment
            key={comment.commentIdentifier}
            comment={comment}
            currentUser={currentUser}
            onDelete={removeComment}
            onUpdate={updateComment}
            selectedTask={selectedTask}
          />
        ))}
      </CommentsListContainer>
    </CommentSectionContainer>
  );
};

export default CommentSection;

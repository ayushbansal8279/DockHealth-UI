import React from 'react';
import Comment from 'components/drawer-common/Comment/Comment';
import { initializeCommentSectionHooks } from './helpers';
import {
  CommentSectionContainer,
  CommentsListContainer,
  Title,
} from './styled';

const CommentSection = ({ selectedTask }) => {
  const { comments, currentUser, removeComment, updateComment } =
    initializeCommentSectionHooks(selectedTask);

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

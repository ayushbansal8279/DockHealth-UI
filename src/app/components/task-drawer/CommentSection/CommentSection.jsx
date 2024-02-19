import React from 'react';
import Comment from 'components/drawer-common/Comment/Comment';
import initializeCommentSectionHooks from './hooks';
import {
  CommentSectionContainer,
  CommentsListContainer,
  Title,
} from './styled';

const CommentSection = ({ selectedTask }) => {
  const {
    comments,
    currentUser,
    removeComment,
    updateComment,
    taskListIdentifier,
  } = initializeCommentSectionHooks(selectedTask);

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
            taskListIdentifier={taskListIdentifier}
            selectedTask={selectedTask}
          />
        ))}
      </CommentsListContainer>
    </CommentSectionContainer>
  );
};

export default CommentSection;

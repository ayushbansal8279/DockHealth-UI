import React from 'react';
import AddComment from '../AddComment/AddComment';
import { CommentSectionContainer, CommentsListContainer } from './styled';
import initializeCommentSectionHooks from './hooks';
import { renderComment } from './helpers';

const CommentSection = ({
  parentFormSubmit,
  taskDrawerFocusField,
  modalActions,
  taskListIdentifier,
}) => {
  const {
    comments,
    currentUser,
    removeComment,
    updateComment,
    addComment,
  } = initializeCommentSectionHooks({ modalActions });

  return (
    <CommentSectionContainer>
      <AddComment
        addComment={addComment}
        parentFormSubmit={parentFormSubmit}
        taskDrawerFocusField={taskDrawerFocusField}
        taskListIdentifier={taskListIdentifier}
      />
      <CommentsListContainer>
        {comments?.map(
          renderComment({
            currentUser,
            removeComment,
            updateComment,
            taskListIdentifier,
          }),
        )}
      </CommentsListContainer>
    </CommentSectionContainer>
  );
};

export default CommentSection;

import React from 'react';

import AddComment from './NewTaskDrawer.AddComment';
import {
  CommentSectionContainer,
  CommentsListContainer,
} from './NewTaskDrawer.CommentSection.Styled';
import initializeCommentSectionHooks from './NewTaskDrawer.CommentSection.Hooks';
import { renderComment } from './NewTaskDrawer.CommentSection.Utilities';

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

import React from 'react';

import AddComment from './NewTaskDrawer.AddComment';
import { CommentSectionContainer } from './NewTaskDrawer.CommentSection.Styled';
import initializeCommentSectionHooks from './NewTaskDrawer.CommentSection.Hooks';
import { renderCommentGroup } from './NewTaskDrawer.CommentSection.Utilities';

const CommentSection = ({
  parentFormSubmit,
  taskDrawerFocusField,
  modalActions,
  taskListIdentifier,
}) => {
  const {
    groupedComments,
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
      {Object.entries(groupedComments).map(
        renderCommentGroup({
          currentUser,
          removeComment,
          updateComment,
        }),
      )}
    </CommentSectionContainer>
  );
};

export default CommentSection;

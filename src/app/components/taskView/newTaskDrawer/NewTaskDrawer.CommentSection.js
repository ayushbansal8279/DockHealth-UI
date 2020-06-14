import React from 'react';

import AddComment from './NewTaskDrawer.AddComment';
import { CommentSectionContainer } from './NewTaskDrawer.CommentSection.Styled';
import initializeCommentSectionHooks from './NewTaskDrawer.CommentSection.Hooks';
import { renderCommentGroup } from './NewTaskDrawer.CommentSection.Utilities';

const CommentSection = ({ parentFormSubmit, taskDrawerFocusField }) => {
  const {
    groupedComments,
    currentTaskListMemberData,
    removeComment,
    updateComment,
    addComment,
  } = initializeCommentSectionHooks();

  return (
    <CommentSectionContainer>
      <AddComment
        addComment={addComment}
        parentFormSubmit={parentFormSubmit}
        taskDrawerFocusField={taskDrawerFocusField}
      />
      {Object.entries(groupedComments).map(
        renderCommentGroup({
          currentUser: currentTaskListMemberData,
          removeComment,
          updateComment,
        }),
      )}
    </CommentSectionContainer>
  );
};

export default CommentSection;

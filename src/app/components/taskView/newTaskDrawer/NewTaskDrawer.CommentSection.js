import React from 'react';

import Spacing from 'components/common/Spacing';

import AddComment from './NewTaskDrawer.AddComment';
import { CommentSectionContainer } from './NewTaskDrawer.CommentSection.Styled';
import initializeCommentSectionHooks from './NewTaskDrawer.CommentSection.Hooks';
import { renderCommentGroup } from './NewTaskDrawer.CommentSection.Utilities';

const CommentSection = ({ parentFormSubmit }) => {
  const {
    groupedComments,
    currentTaskListMemberData,
    removeComment,
    updateComment,
    addComment,
  } = initializeCommentSectionHooks();

  return (
    <CommentSectionContainer>
      <AddComment addComment={addComment} parentFormSubmit={parentFormSubmit} />
      <Spacing vertical={4} />
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

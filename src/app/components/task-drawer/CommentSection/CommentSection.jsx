import React from 'react';
import AddComment from '../AddComment/AddComment';
import { CommentSectionContainer, CommentsListContainer } from './styled';
import initializeCommentSectionHooks from './hooks';
import { renderComment } from './helpers';

const CommentSection = () => {
  const {
    comments,
    currentUser,
    removeComment,
    updateComment,
    addComment,
    taskListIdentifier,
    isTemplateTask,
    taskDrawerFocusField,
  } = initializeCommentSectionHooks();

  return (
    <CommentSectionContainer>
      <AddComment
        addComment={addComment}
        taskDrawerFocusField={taskDrawerFocusField}
        taskListIdentifier={taskListIdentifier}
        isTemplateTask={isTemplateTask}
      />
      <CommentsListContainer>
        {comments?.map(
          renderComment({
            currentUser,
            removeComment,
            updateComment,
            taskListIdentifier,
            isTemplateTask,
          }),
        )}
      </CommentsListContainer>
    </CommentSectionContainer>
  );
};

export default CommentSection;

import React from 'react';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import Comment from 'components/drawer-common/Comment/Comment';
import AddComment from 'components/drawer-common/AddComment/AddComment';
import { CommentSectionContainer, CommentsListContainer } from './styled';
import initializeCommentSectionHooks from './hooks';

const CommentSection = () => {
  const {
    comments,
    currentUser,
    removeComment,
    updateComment,
    addComment,
    taskListIdentifier,
    taskDrawerFocusField,
  } = initializeCommentSectionHooks();

  return (
    <CommentSectionContainer>
      <AddComment
        autoFocus={taskDrawerFocusField === DrawerFieldEnum.COMMENT}
        taskListIdentifier={taskListIdentifier}
        onAdd={addComment}
      />
      <CommentsListContainer>
        {comments?.map(comment => (
          <Comment
            key={comment.commentIdentifier}
            comment={comment}
            currentUser={currentUser}
            onDelete={removeComment}
            onUpdate={updateComment}
            taskListIdentifier={taskListIdentifier}
          />
        ))}
      </CommentsListContainer>
    </CommentSectionContainer>
  );
};

export default CommentSection;

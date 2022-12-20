import React from 'react';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import Comment from 'components/drawer-common/Comment/Comment';
import AddComment from 'components/drawer-common/AddComment/AddComment';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  SINGLE_TASK_RESTRICTIONS_OPTIONS,
  SINGLE_TASK_RESTRICTIONS_PROFILES,
} from 'restrictions/task-restrictions';
import initializeCommentSectionHooks from './hooks';
import {
  CommentSectionContainer,
  CommentsListContainer,
  Title,
} from './styled';

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

  const { orgUserRole } = useSelector(userProfileSelector);
  const restrictions = SINGLE_TASK_RESTRICTIONS_PROFILES[orgUserRole];
  const { DISABLED } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

  return (
    <CommentSectionContainer>
      <Title>Comments</Title>
      {restrictions?.comments !== DISABLED && (
        <AddComment
          autoFocus={taskDrawerFocusField === DrawerFieldEnum.COMMENT}
          taskListIdentifier={taskListIdentifier}
          onAdd={addComment}
        />
      )}
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

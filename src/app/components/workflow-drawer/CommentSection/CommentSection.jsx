import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  workflowIdentifierSelector,
  workflowCommentsSelector,
  isWorkflowTemplateSelector,
  workflowListIdentifierSelector,
} from 'selectors/workflow-drawer-selectors';
import AddComment from 'components/drawer-common/AddComment/AddComment';
import Comment from 'components/drawer-common/Comment/Comment';
import * as WorkflowActions from 'actions/workflow-actions';
import { userProfileSelector } from 'selectors/user-selectors';

const CommentSection = ({ disabled }) => {
  const dispatch = useDispatch();
  const workflowIdentifier = useSelector(workflowIdentifierSelector);
  const currentUser = useSelector(userProfileSelector);
  const comments = useSelector(workflowCommentsSelector);
  const isWorkflowTemplate = useSelector(isWorkflowTemplateSelector);
  const workflowListIdentifier = useSelector(workflowListIdentifierSelector);

  const handleAddComment = (tokenizedComment) => {
    dispatch(
      WorkflowActions.addWorkflowComment(workflowIdentifier, tokenizedComment),
    );
  };

  const handleUpdateComment = ({ commentIdentifier, comment }) => {
    dispatch(
      WorkflowActions.updateWorkflowComment(
        workflowIdentifier,
        commentIdentifier,
        comment,
      ),
    );
  };

  const handleDeleteComment = ({ commentIdentifier }) => {
    dispatch(
      WorkflowActions.deleteWorkflowComment(
        workflowIdentifier,
        commentIdentifier,
      ),
    );
  };

  return (
    <>
      {!disabled && (
        <AddComment
          disableMentions={isWorkflowTemplate}
          taskListIdentifier={workflowListIdentifier}
          onAdd={handleAddComment}
        />
      )}
      {comments?.map((comment) => (
        <Comment
          key={comment.commentIdentifier}
          disableMentions={isWorkflowTemplate}
          taskListIdentifier={workflowListIdentifier}
          comment={comment}
          currentUser={currentUser}
          onUpdate={handleUpdateComment}
          onDelete={handleDeleteComment}
        />
      ))}
    </>
  );
};

export default CommentSection;

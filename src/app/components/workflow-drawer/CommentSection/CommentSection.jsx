import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  workflowIdentifierSelector,
  workflowCommentsSelector,
  isWorkflowTemplateSelector,
  workflowListIdentifierSelector,
} from 'selectors/workflow-drawer-selectors';
import Comment from 'components/drawer-common/Comment/Comment';
import * as WorkflowActions from 'actions/workflow-actions';
import { userProfileSelector } from 'selectors/user-selectors';
import { Title } from './styled';

const CommentSection = () => {
  const dispatch = useDispatch();
  const workflowIdentifier = useSelector(workflowIdentifierSelector);
  const currentUser = useSelector(userProfileSelector);
  const comments = useSelector(workflowCommentsSelector);
  const isWorkflowTemplate = useSelector(isWorkflowTemplateSelector);
  const workflowListIdentifier = useSelector(workflowListIdentifierSelector);

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
      <Title>Comments</Title>
      {comments?.map((comment) => (
        <Comment
          key={comment.commentIdentifier}
          disableMentions={isWorkflowTemplate}
          taskListIdentifier={workflowListIdentifier}
          comment={comment}
          currentUser={currentUser}
          onUpdate={handleUpdateComment}
          onDelete={handleDeleteComment}
          mentions={comment.commentMentions}
        />
      ))}
    </>
  );
};

export default CommentSection;

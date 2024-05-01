import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  workflowIdentifierSelector,
  workflowCommentsSelector,
  isWorkflowTemplateSelector,
  workflowListIdentifierSelector,
} from 'selectors/workflow-drawer-selectors';
import AddComment from 'components/drawer-common/AddComment/AddComment';
import * as WorkflowActions from 'actions/workflow-actions';
import { userProfileSelector } from 'selectors/user-selectors';

import { Box, IconButton } from '@mui/material';
import Divider from '@mui/material/Divider';
import palette from '@/app/styles/palette';
import CloseIcon from '@mui/icons-material/Close';
import { Task } from '@/app/types/Task';
import { initializeCommentSectionHooks } from '@/app/components/task-drawer/CommentSection/helpers';
import {
  SINGLE_TASK_RESTRICTIONS_OPTIONS,
  SINGLE_TASK_RESTRICTIONS_PROFILES,
} from '@/app/restrictions/task-restrictions';
import { ContainerCard } from 'components/task/CommentsInPopover/styled';
import Comment from 'components/task/CommentsInPopover/Comment';
import {
  openDrawer,
  setCommentIdentifierToScroll,
} from 'actions/task-drawer-actions';
import { storeAsCurrentTask } from 'actions/task-actions';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import { IComment } from '@/app/types/Comment';

interface Props {
  onClose: VoidFunction;
  comments: Comment;
  disabled: boolean;
}

export default function CommentsInPopover({
  onClose,
  comments,
  disabled,
}: Props) {
  const dispatch = useDispatch();
  const workflowIdentifier = useSelector(workflowIdentifierSelector);
  const currentUser = useSelector(userProfileSelector);

  const addComment = (tokenizedComment: string) => {
    dispatch(
      WorkflowActions.addWorkflowComment(workflowIdentifier, tokenizedComment),
    );
  };

  const handleClickComment = useCallback(
    (commentIdentifier: string) => {
      // todo
      // dispatch(setCommentIdentifierToScroll(commentIdentifier));
      // dispatch(openDrawer(DrawerFieldEnum.COMMENT) as any);
      // dispatch(storeAsCurrentTask(task) as any);
      onClose();
    },
    [workflowIdentifier],
  );

  return (
    <ContainerCard>
      <Box sx={{ m: 1, textAlign: 'right' }}>
        <IconButton aria-label="close-comments" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ maxHeight: '300px', overflowY: 'scroll', paddingX: 2 }}>
        {comments?.map((comment) => (
          <div key={comment.commentIdentifier}>
            <Comment
              key={comment.commentIdentifier}
              comment={comment}
              onClick={() =>
                handleClickComment(comment.commentIdentifier ?? '')
              }
            />
            <Divider variant="middle" />
          </div>
        ))}
      </Box>
      {!disabled && (
        <Box sx={{ padding: 2, backgroundColor: palette.coolGrey4 }}>
          <AddComment autoFocus onAdd={addComment} />
        </Box>
      )}
    </ContainerCard>
  );
}

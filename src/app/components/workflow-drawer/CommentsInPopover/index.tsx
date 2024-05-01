import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import AddComment from 'components/drawer-common/AddComment/AddComment';
import * as WorkflowActions from 'actions/workflow-actions';

import { Box, IconButton } from '@mui/material';
import Divider from '@mui/material/Divider';
import palette from '@/app/styles/palette';
import CloseIcon from '@mui/icons-material/Close';
import { ContainerCard } from 'components/task/CommentsInPopover/styled';
import Comment from 'components/task/CommentsInPopover/Comment';
import {
  openDrawer as openWorkflowDrawer,
  setWorkflowCommentIdentifierToScroll,
} from '@/app/actions/workflow-drawer-actions';
import { IComment } from '@/app/types/Comment';

interface Props {
  workflowIdentifier: string;
  onClose: VoidFunction;
  comments: IComment[];
  disabled?: boolean;
}

export default function CommentsInPopover({
  workflowIdentifier,
  onClose,
  comments,
  disabled,
}: Props) {
  const dispatch = useDispatch();

  const addComment = (tokenizedComment: string) => {
    dispatch(
      WorkflowActions.addWorkflowComment(workflowIdentifier, tokenizedComment),
    );
  };

  const handleClickComment = useCallback(
    (commentIdentifier: string) => {
      dispatch(setWorkflowCommentIdentifierToScroll(commentIdentifier));
      dispatch(openWorkflowDrawer(workflowIdentifier));
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

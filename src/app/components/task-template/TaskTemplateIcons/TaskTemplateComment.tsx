import React, { useCallback } from 'react';
import { Grid, Popover } from '@mui/material';
import { openDrawer } from 'actions/workflow-drawer-actions';
import {
  getLabelsIconTooltipTitle,
  getAttachmentsIconTooltipTitle,
  getCommentsIconTooltipTitle,
} from 'helpers/task-helpers';
import { WorkflowDrawerFieldNames } from 'helpers/workflow-drawer-helpers';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import { SINGLE_TASK_RESTRICTIONS_OPTIONS } from 'restrictions/task-restrictions';
import { GridImg } from './styled';
import TaskLabel from '../../common/TaskLabel/TaskLabel';
import CommentsInPopover from '../../workflow-drawer/CommentsInPopover';

export default function TaskTemplateComment({
  workflow,
  comments,
  matchComments,
  isHover,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const commentPopoverOpen = Boolean(anchorEl);

  const onCommentClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleCloseComments = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  // const onCommentClick = useCallback(() => {
  //   console.log('here?');
  //   dispatch(
  //     openDrawer(
  //       workflow.identifier,
  //       workflow,
  //       WorkflowDrawerFieldNames.COMMENT,
  //     ),
  //   );
  // }, [workflow]);

  return (
    <Grid container>
      <GridImg item xs={12} matched={matchComments}>
        <Tooltip
          placement="top"
          title={
            comments?.length > 0
              ? getCommentsIconTooltipTitle(comments)
              : 'Add Comment'
          }
        >
          <button type="button" onClick={onCommentClick}>
            {(comments?.length > 0 || isHover.comment) && (
              <TaskIcon type="comments" isActive={comments?.length > 0} />
            )}
          </button>
        </Tooltip>
      </GridImg>

      <Popover
        anchorEl={anchorEl}
        open={commentPopoverOpen}
        style={{ zIndex: 2000 }}
        onClose={handleCloseComments}
      >
        <CommentsInPopover comments={comments} onClose={handleCloseComments} />
      </Popover>
    </Grid>
  );
}

import React, { useCallback } from 'react';
import { Grid, Popover } from '@mui/material';
import { getCommentsIconTooltipTitle } from 'helpers/task-helpers';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import {
  SINGLE_WORKFLOW_RESTRICTIONS_PROFILES,
  WORKFLOW_LIST_RESTRICTIONS_OPTIONS,
} from 'restrictions/task-restrictions';
import { useSelector } from 'react-redux';
import { CommentsContainer, CommentsWrapper, GridImg } from './styled';
import CommentsInPopover from '../../workflow-drawer/CommentsInPopover';
import { IComment } from '@/app/types/Comment';
import { userProfileSelector } from '@/app/selectors/user-selectors';

const { DISABLED } = WORKFLOW_LIST_RESTRICTIONS_OPTIONS;

interface Props {
  workflow: any;
  comments: IComment[];
  matchComments: any[];
  isBorderColumnItem: boolean;
}

export default function TaskTemplateComment({
  workflow,
  comments,
  matchComments,
  isBorderColumnItem,
}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const commentPopoverOpen = Boolean(anchorEl);
  const hasComments = comments?.length > 0;
  const tooltipTitle = hasComments ? 'Show Comments' : 'Add Comment';

  const { orgUserRole } = useSelector(userProfileSelector);
  const restrictions = SINGLE_WORKFLOW_RESTRICTIONS_PROFILES[orgUserRole];

  const onCommentClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleCloseComments = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  return (
    <CommentsContainer>
      <Grid container>
        <GridImg item xs={12} matched={matchComments}>
          <Tooltip placement="top" title={tooltipTitle}>
            <button type="button" onClick={onCommentClick}>
              <CommentsWrapper
                isBorderColumnItem={isBorderColumnItem}
                hasComments={comments?.length > 0}
              >
                <TaskIcon type="comments" isActive={comments?.length > 0} />
              </CommentsWrapper>
            </button>
          </Tooltip>
        </GridImg>

        <Popover
          anchorEl={anchorEl}
          open={commentPopoverOpen}
          style={{ zIndex: 2000 }}
          onClose={handleCloseComments}
        >
          <CommentsInPopover
            workflowIdentifier={workflow.identifier}
            comments={comments}
            onClose={handleCloseComments}
            disabled={restrictions?.comments === DISABLED}
          />
        </Popover>
      </Grid>
    </CommentsContainer>
  );
}

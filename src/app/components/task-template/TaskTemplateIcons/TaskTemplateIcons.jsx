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

const TaskTemplateIcons = ({
  workflow,
  dispatch,
  labels,
  matchLabels,
  attachments,
  matchAttachments,
  comments,
  matchComments,
  isHover,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { restrictions } = workflow ?? {};
  const commentPopoverOpen = Boolean(anchorEl);
  console.log('original workflow', workflow);

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

  const onLabelClick = useCallback(() => {
    dispatch(
      openDrawer(workflow.identifier, workflow, WorkflowDrawerFieldNames.LABEL),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow]);

  const onAttachmentsClick = useCallback(() => {
    dispatch(
      openDrawer(
        workflow.identifier,
        workflow,
        WorkflowDrawerFieldNames.ATTACHMENT,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow]);

  return (
    <Grid container>
      {comments ? (
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
                <TaskIcon
                  type="comments"
                  isActive={comments?.length > 0}
                  // isNew={workflow?.updatedComment}
                />
              )}
            </button>
          </Tooltip>
        </GridImg>
      ) : null}
      {labels ? (
        labels.length > 0 ? (
          <TaskLabel
            getLabelsIconTooltipTitle={getLabelsIconTooltipTitle}
            labels={labels}
            onClick={onLabelClick}
          />
        ) : (
          <GridImg item xs={12} matched={matchLabels}>
            <Tooltip
              hideTooltip={
                restrictions?.labels ===
                SINGLE_TASK_RESTRICTIONS_OPTIONS.DISABLED
              }
              placement="top"
              title="Add Label"
            >
              <button
                disabled={
                  restrictions?.labels ===
                  SINGLE_TASK_RESTRICTIONS_OPTIONS.DISABLED
                }
                type="button"
                onClick={onLabelClick}
              >
                {(labels?.length > 0 || isHover.label) && (
                  <TaskIcon
                    type="labels"
                    isActive={labels?.length > 0}
                    // isNew={workflow?.updatedLabel}
                  />
                )}
              </button>
            </Tooltip>
          </GridImg>
        )
      ) : null}
      {attachments ? (
        <GridImg item xs={12} matched={matchAttachments}>
          <Tooltip
            placement="top"
            title={
              attachments?.length > 0
                ? getAttachmentsIconTooltipTitle(attachments)
                : 'Add File'
            }
          >
            <button type="button" onClick={onAttachmentsClick}>
              {(attachments?.length > 0 || isHover.file) && (
                <TaskIcon
                  type="attachments"
                  isActive={attachments?.length > 0}
                  // isNew={workflow?.updatedAttachment}
                />
              )}
            </button>
          </Tooltip>
        </GridImg>
      ) : null}

      <Popover
        anchorEl={anchorEl}
        open={commentPopoverOpen}
        style={{ zIndex: 2000 }}
        onClose={handleCloseComments}
      >
        <CommentsInPopover onClose={handleCloseComments} />
      </Popover>
    </Grid>
  );
};

export default TaskTemplateIcons;

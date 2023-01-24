import React, { useCallback } from 'react';
import { Grid } from '@material-ui/core';
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

const TaskTemplateIcons = ({
  workflow,
  dispatch,
  labels,
  matchLabels,
  attachments,
  matchAttachments,
  comments,
  matchComments,
}) => {
  const { restrictions } = workflow ?? {};

  const onCommentClick = useCallback(() => {
    dispatch(
      openDrawer(
        workflow.identifier,
        workflow,
        WorkflowDrawerFieldNames.COMMENT,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow]);

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
                : 'Add a new comment'
            }
          >
            <button type="button" onClick={onCommentClick}>
              <TaskIcon
                type="comments"
                isActive={comments?.length > 0}
                // isNew={workflow?.updatedComment}
              />
            </button>
          </Tooltip>
        </GridImg>
      ) : null}
      {labels ? (
        <GridImg item xs={12} matched={matchLabels}>
          <Tooltip
            hideTooltip={
              restrictions?.labels === SINGLE_TASK_RESTRICTIONS_OPTIONS.DISABLED
            }
            placement="top"
            title={
              labels?.length > 0
                ? getLabelsIconTooltipTitle(labels)
                : 'Add label'
            }
          >
            <button
              disabled={
                restrictions?.labels ===
                SINGLE_TASK_RESTRICTIONS_OPTIONS.DISABLED
              }
              type="button"
              onClick={onLabelClick}
            >
              <TaskIcon
                type="labels"
                isActive={labels?.length > 0}
                // isNew={workflow?.updatedLabel}
              />
            </button>
          </Tooltip>
        </GridImg>
      ) : null}
      {attachments ? (
        <GridImg item xs={12} matched={matchAttachments}>
          <Tooltip
            placement="top"
            title={
              attachments?.length > 0
                ? getAttachmentsIconTooltipTitle(attachments)
                : 'Add file'
            }
          >
            <button type="button" onClick={onAttachmentsClick}>
              <TaskIcon
                type="attachments"
                isActive={attachments?.length > 0}
                // isNew={workflow?.updatedAttachment}
              />
            </button>
          </Tooltip>
        </GridImg>
      ) : null}
    </Grid>
  );
};

export default TaskTemplateIcons;

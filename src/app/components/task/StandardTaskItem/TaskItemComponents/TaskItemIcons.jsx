import React, { useCallback } from 'react';
import { Grid } from '@mui/material';
import { storeAsCurrentTask } from 'actions/task-actions';
import { openDrawer } from 'actions/task-drawer-actions';
import {
  getLabelsIconTooltipTitle,
  getAttachmentsIconTooltipTitle,
  getCommentsIconTooltipTitle,
} from 'helpers/task-helpers';
import { DrawerFieldEnum } from 'helpers/task-drawer-helpers';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskIcon from 'components/task/TaskIcon/TaskIcon';
import { SINGLE_TASK_RESTRICTIONS_OPTIONS } from 'restrictions/task-restrictions';
import { GridImg } from '../../styled';

const TaskItemIcons = ({
  matchComments,
  comments,
  task,
  matchLabels,
  labels,
  matchAttachments,
  attachments,
  dispatch,
  restrictions,
}) => {
  const onCommentClick = useCallback(() => {
    dispatch(openDrawer(DrawerFieldEnum.COMMENT));
    dispatch(storeAsCurrentTask(task));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  const onLabelClick = useCallback(() => {
    dispatch(openDrawer(DrawerFieldEnum.LABEL));
    dispatch(storeAsCurrentTask(task));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  const onAttachmentsClick = useCallback(() => {
    dispatch(openDrawer(DrawerFieldEnum.ATTACHMENT));
    dispatch(storeAsCurrentTask(task));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);
  return (
    <Grid container wrap="nowrap">
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
              <TaskIcon
                type="comments"
                isActive={comments?.length > 0}
                isNew={task.updatedComment}
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
                : 'Add Label'
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
                isNew={task.updatedLabel}
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
                : 'Add File'
            }
          >
            <button type="button" onClick={onAttachmentsClick}>
              <TaskIcon
                type="attachments"
                isActive={attachments?.length > 0}
                isNew={task.updatedAttachment}
              />
            </button>
          </Tooltip>
        </GridImg>
      ) : null}
    </Grid>
  );
};

export default TaskItemIcons;

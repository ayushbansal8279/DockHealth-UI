import React, { useCallback } from 'react';
import { Box, Grid } from '@mui/material';
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
import {
  FilesContainer,
  FilesWrapper,
  GridImg,
  LabelContainer,
  LabelWrapper,
} from '../../styled';
import TaskLabel from '@/app/components/common/TaskLabel/TaskLabel';
import TaskItemComments from './TaskItemComments';

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
  isBorderColumnItem,
}) => {
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
        <TaskItemComments
          matchComments={matchComments}
          comments={comments}
          task={task}
          isBorderColumnItem={isBorderColumnItem}
        />
      ) : null}
      {labels ? (
        labels.length > 0 ? (
          isBorderColumnItem ? (
            <Box marginLeft="5px" marginTop="-2px">
              <TaskLabel
                getLabelsIconTooltipTitle={getLabelsIconTooltipTitle}
                labels={labels}
                onClick={onLabelClick}
                isBorderColumnItem={isBorderColumnItem}
              />
            </Box>
          ) : (
            <TaskLabel
              getLabelsIconTooltipTitle={getLabelsIconTooltipTitle}
              labels={labels}
              onClick={onLabelClick}
              isBorderColumnItem={isBorderColumnItem}
            />
          )
        ) : (
          <LabelContainer>
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
                  <LabelWrapper isBorderColumnItem={isBorderColumnItem}>
                    <TaskIcon
                      type="labels"
                      isActive={labels?.length > 0}
                      isNew={task.updatedLabel}
                    />
                  </LabelWrapper>
                </button>
              </Tooltip>
            </GridImg>
          </LabelContainer>
        )
      ) : null}
      {attachments ? (
        <FilesContainer>
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
                <FilesWrapper
                  isBorderColumnItem={isBorderColumnItem}
                  attachments={attachments?.length > 0}
                >
                  <TaskIcon
                    type="attachments"
                    isActive={attachments?.length > 0}
                    isNew={task.updatedAttachment}
                  />
                </FilesWrapper>
              </button>
            </Tooltip>
          </GridImg>
        </FilesContainer>
      ) : null}
    </Grid>
  );
};

export default TaskItemIcons;

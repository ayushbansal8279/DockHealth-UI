import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { partialUpdateTask, storeAsCurrentTask } from 'actions/task-actions';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import { TaskItemType } from 'helpers/task-helpers';
import { openDrawer } from 'actions/workflow-drawer-actions';
import PopoverBottomBar from 'components/task/PopoverBottomBar/PopoverBottomBar';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import debounce from 'lodash.debounce';
import { convertToSimpleString } from 'helpers/markdown-helper.js';
import {
  Text,
  LongTextBox,
  Divider,
} from '../customFieldsTaskItemComponents/TaskItemLongText/styled';

const TaskItemDetails = ({ task, onClick, readOnly }) => {
  const detailsReference = useRef(null);

  const isWorkflow =
    task.itemType === TaskItemType.BUNDLE ||
    task.itemType === TaskItemType.TEMPLATE;

  const { identifier } = task;
  const dispatch = useDispatch();

  const [details, setDetails] = useState(task?.tokenizedDetails);
  const [unformattedDetails, setUnformattedDetails] = useState(null);

  const handleOpenDrawer = useCallback(() => {
    dispatch(openDrawer());
    dispatch(storeAsCurrentTask(task));
  }, [dispatch, task]);

  useEffect(() => {
    setDetails(task?.tokenizedDetails);
    const rawTextUnFormatted = convertToSimpleString(task?.details);
    setUnformattedDetails(rawTextUnFormatted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateTaskDetails = useCallback((value) => {
    if (value && value !== (task?.tokenizedDetails || '')) {
      if (isWorkflow) {
        dispatch(
          updatePartialWorkflow(identifier, {
            details: value,
          }),
        );
      } else {
        dispatch(partialUpdateTask(identifier, { details: value }));
      }
    }
  });

  const handleAutoSave = React.useRef(
    debounce((value) => {
      updateTaskDetails(value);
      // eslint-disable-next-line unicorn/numeric-separators-style
    }, 10000),
  ).current;

  const handleChange = (value) => {
    setDetails(value);
    handleAutoSave.cancel();
    handleAutoSave(value);
  };

  const handleBlur = useCallback(
    (closePopover) => (value) => {
      updateTaskDetails(value);
      handleAutoSave.cancel();
      closePopover();
    },
    [handleAutoSave, updateTaskDetails],
  );

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleOnClose = () => {
    updateTaskDetails(details);
    handleAutoSave.cancel();
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handlePopupClose = (closePopover, onClose) => () => {
    onClose();
    closePopover();
  };

  return (
    <Box width="100%" height="100%" display="flex" alignItems="center">
      <TaskItemPopover
        fullWidth
        // eslint-disable-next-line react/no-unstable-nested-components
        content={({ closePopover, onClose }) => (
          <Box
            width="550px"
            height="100%"
            alignItems="center"
            style={{ padding: '5px' }}
          >
            <CustomTextEditor
              key="TASK_DETAILS"
              empty={false}
              focused
              label="Details"
              richTextEnabled
            >
              <RichTextEditor
                ref={detailsReference}
                readonly={readOnly}
                value={details}
                onChange={handleChange}
                onBlur={handleBlur(closePopover)}
                initOnClick={false}
                showCharCount
              />
            </CustomTextEditor>
            <Divider />
            <PopoverBottomBar align="spread">
              <PopoverBottomBar.Button
                type="button"
                onClick={handlePopupClose(closePopover, onClose)}
              >
                Close
              </PopoverBottomBar.Button>
              {handleOpenDrawer && (
                <PopoverBottomBar.Button
                  type="button"
                  onClick={() => {
                    onClick();
                  }}
                >
                  Open Drawer
                </PopoverBottomBar.Button>
              )}
            </PopoverBottomBar>
          </Box>
        )}
        onClose={handleOnClose}
      >
        <LongTextBox>
          <Tooltip
            placement="right-end"
            title={
              <pre
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: '16px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'keep-all',
                }}
              >
                {unformattedDetails}
              </pre>
            }
          >
            <Text>{unformattedDetails}</Text>
          </Tooltip>
        </LongTextBox>
      </TaskItemPopover>
    </Box>
  );
};

export default TaskItemDetails;

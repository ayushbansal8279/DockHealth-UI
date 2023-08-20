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
// import { FieldCharakterLimit } from 'helpers/field-type-helpers';
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

  const [details, setDetails] = useState(task?.details);
  const [rawDetails, setRawDetails] = useState(null);

  const handleOpenDrawer = useCallback(() => {
    dispatch(openDrawer());
    dispatch(storeAsCurrentTask(task));
  }, [dispatch, task]);

  useEffect(() => {
    setDetails(task?.details);
    const rawTextUnFormatted = convertToSimpleString(task?.details);
    setRawDetails(rawTextUnFormatted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  const handleAutoSave = debounce((value) => {
    if (value !== (details || '')) {
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
    // eslint-disable-next-line unicorn/numeric-separators-style
  }, 10000);

  const handleChange = (value) => {
    setDetails(value);
    handleAutoSave();
  };

  const handleBlur = (closePopover) => (value) => {
    if (value !== (details || '')) {
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
    closePopover();
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handlePopupClose = (closePopover) => (_) => {
    closePopover();
  };

  return (
    <Box width="100%" height="100%" display="flex" alignItems="center">
      <TaskItemPopover
        fullWidth
        // eslint-disable-next-line react/no-unstable-nested-components
        content={({ closePopover }) => (
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
                initOnClick
                showCharCount
              />
            </CustomTextEditor>
            <Divider />
            <PopoverBottomBar align="spread">
              <PopoverBottomBar.Button
                type="button"
                onClick={handlePopupClose(closePopover)}
              >
                Close
              </PopoverBottomBar.Button>
              {handleOpenDrawer && (
                <PopoverBottomBar.Button
                  type="button"
                  onClick={() => {
                    onClick();
                    handlePopupClose(closePopover);
                  }}
                >
                  Open Drawer
                </PopoverBottomBar.Button>
              )}
            </PopoverBottomBar>
          </Box>
        )}
      >
        <LongTextBox>
          <Tooltip
            placement="top"
            title={
              <pre
                style={{
                  fontFamily: "'Roboto Condensed', sans-serif",
                  fontSize: '16px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'keep-all',
                }}
              >
                {rawDetails}
              </pre>
            }
          >
            <Text>{rawDetails}</Text>
          </Tooltip>
        </LongTextBox>
      </TaskItemPopover>
    </Box>
  );
};

export default TaskItemDetails;

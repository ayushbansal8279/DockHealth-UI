import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updatePartialWorkflow } from 'actions/task-template-actions';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import CustomTextEditor from 'components/common/CustomTextEditor/CustomTextEditor';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import debounce from 'lodash.debounce';
// import { TaskItemType } from 'helpers/task-helpers';
import { openDrawer } from 'actions/workflow-drawer-actions';
import { WorkflowDrawerFieldNames } from 'helpers/workflow-drawer-helpers';
import PopoverBottomBar from 'components/task/PopoverBottomBar/PopoverBottomBar';
import { convertToSimpleString } from 'helpers/markdown-helper.js';
import { Text, LongTextBox, Divider } from './styled';

const TaskTemplateDetails = ({ workflow, readOnly }) => {
  const detailsReference = useRef(null);

  // const isWorkflow =
  //   workflow.itemType === TaskItemType.BUNDLE ||
  //   workflow.itemType === TaskItemType.TEMPLATE;

  const dispatch = useDispatch();
  const [details, setDetails] = useState(workflow?.tokenizedDescription);
  const [unformattedDetails, setUnformattedDetails] = useState(null);

  useEffect(() => {
    setDetails(workflow?.tokenizedDescription);
    const rawTextUnFormatted = convertToSimpleString(workflow?.description);
    setUnformattedDetails(rawTextUnFormatted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow]);

  const handleOpenDrawer = useCallback(() => {
    dispatch(
      openDrawer(
        workflow.identifier,
        workflow,
        WorkflowDrawerFieldNames.COMMENT,
      ),
    );
  }, [dispatch, workflow]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateWorkflowDetails = useCallback((value) => {
    if (value !== (workflow?.tokenizedDescription || '')) {
      dispatch(
        updatePartialWorkflow(workflow?.identifier, {
          description: value,
          descriptionCleared: !value,
        }),
      );
    }
  });

  const handleAutoSave = React.useRef(
    debounce((value) => {
      updateWorkflowDetails(value);
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
      updateWorkflowDetails(value);
      handleAutoSave.cancel();
      closePopover();
    },
    [handleAutoSave, updateWorkflowDetails],
  );

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleOnClose = () => {
    updateWorkflowDetails(details);
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
                    // onClick();
                    handleOpenDrawer();
                    closePopover();
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

export default TaskTemplateDetails;

import React, { useCallback, useRef, useState } from 'react';
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
import { Text, LongTextBox, Divider } from './styled';

const TaskTemplateDetails = ({ workflow, readOnly }) => {
  const detailsReference = useRef(null);

  // const isWorkflow =
  //   workflow.itemType === TaskItemType.BUNDLE ||
  //   workflow.itemType === TaskItemType.TEMPLATE;

  const dispatch = useDispatch();
  const [details, setDetails] = useState(workflow?.tokenizedDescription);

  const handleOpenDrawer = useCallback(() => {
    dispatch(
      openDrawer(
        workflow.identifier,
        workflow,
        WorkflowDrawerFieldNames.COMMENT,
      ),
    );
  }, [dispatch, workflow]);

  const handleAutoSave = debounce((value) => {
    if (value !== (details || '')) {
      dispatch(
        updatePartialWorkflow(workflow?.identifier, {
          description: value,
          descriptionCleared: !value,
        }),
      );
    }
    // eslint-disable-next-line unicorn/numeric-separators-style
  }, 10000);

  const handleChange = (value) => {
    setDetails(value);
    handleAutoSave();
  };

  const handleBlur = useCallback(
    (value) => {
      if (value !== (details || '')) {
        dispatch(
          updatePartialWorkflow(workflow?.identifier, {
            description: value,
            descriptionCleared: !value,
          }),
        );
      }
    },
    [details, dispatch, workflow?.identifier],
  );

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
                onBlur={handleBlur}
                initOnClick
                showCharCount
              />
            </CustomTextEditor>
            <Divider />
            <PopoverBottomBar align="spread">
              <PopoverBottomBar.Button type="button" onClick={closePopover}>
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
                {details}
              </pre>
            }
          >
            <Text>{details}</Text>
          </Tooltip>
        </LongTextBox>
      </TaskItemPopover>
    </Box>
  );
};

export default TaskTemplateDetails;

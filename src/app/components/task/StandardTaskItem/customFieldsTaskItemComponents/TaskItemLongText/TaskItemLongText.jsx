import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import PopoverBottomBar from 'components/task/PopoverBottomBar/PopoverBottomBar';
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor';
import { convertToSimpleString } from 'helpers/markdown-helper.js';
import { Text, LongTextBox, Divider } from './styled';

const TaskItemLongText = ({ value = '', onChange, openDrawer, disabled = false }) => {
  const [rawDetails, setRawDetails] = useState(null);
  const [unformattedDetails, setUnformattedDetails] = useState(null);

  useEffect(() => {
    setRawDetails(value);
    const rawTextUnFormatted = convertToSimpleString(value);
    setUnformattedDetails(rawTextUnFormatted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // eslint-disable-next-line no-shadow
  const handleChange = (value) => {
    setRawDetails(value);
  };

  // eslint-disable-next-line no-shadow
  const handleBlur = (closePopover) => (updatedValue) => {
    // console.log(`handleBlur: ${value}`);
    // blur not invoked if clicked outside popover
    if (updatedValue !== value) {
      onChange(updatedValue);
    }
    // close the popover if blur is invoked when close button is clicked
    closePopover();
  };

  const handleOnClose = () => {
    // console.log('handleOnClose');
    if (rawDetails !== value) {
      onChange(rawDetails);
    }
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handlePopupClose = (closePopover, onClose) => () => {
    // console.log('handle popup close');
    onClose();
    closePopover();
  };

  return (
    <Box width="100%" height="100%" display="flex" alignItems="center">
      <TaskItemPopover
        disabled={disabled}
        fullWidth
        // eslint-disable-next-line react/no-unstable-nested-components
        content={({ closePopover, onClose }) => (
          <Box
            width="550px"
            height="100%"
            alignItems="center"
            style={{ padding: '5px' }}
          >
            <RichTextEditor
              value={rawDetails}
              onChange={handleChange}
              onBlur={handleBlur(closePopover)}
              initOnClick={false}
              showCharCount
            />
            <Divider />
            <PopoverBottomBar align="spread">
              <PopoverBottomBar.Button
                type="button"
                onClick={handlePopupClose(closePopover, onClose)}
              >
                Close
              </PopoverBottomBar.Button>
              {openDrawer && (
                <PopoverBottomBar.Button
                  type="button"
                  onClick={() => {
                    openDrawer();
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

export default TaskItemLongText;

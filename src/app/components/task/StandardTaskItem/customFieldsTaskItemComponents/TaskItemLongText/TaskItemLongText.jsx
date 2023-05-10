import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskItemPopover from 'components/task/TaskItemPopover/TaskItemPopover';
import PopoverBottomBar from 'components/task/PopoverBottomBar/PopoverBottomBar';
import TextEditor from 'ui-toolkit/Form/TextEditor/TextEditor';
import { convertToSimpleString } from 'ui-toolkit/Form/TextEditor/helpers';
import { Text, LongTextBox, Divider } from './styled';

const TaskItemLongText = ({
  value = '',
  onChange,
  openDrawer,
}) => {
  const [rawDetails, setRawDetails] = useState(null);

  useEffect(() => {
    const rawTextUnFormatted = convertToSimpleString(value);
    setRawDetails(rawTextUnFormatted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleTextEditorBlur = (closePopover) => (_, { value }) => {
    closePopover();
    onChange(value);
  };

  return (
    <Box width="100%" height="100%" display="flex" alignItems="center">
      <TaskItemPopover
        fullWidth
        // eslint-disable-next-line react/no-unstable-nested-components
        content={({ closePopover }) => (
          <Box
            width="100%"
            height="100%"
            alignItems="center"
            style={{ padding: '5px' }}
          >
            <TextEditor
              autofocus
              value={value}
              onBlur={handleTextEditorBlur(closePopover)}
            />
            <Divider />
            <PopoverBottomBar align="spread">
              <PopoverBottomBar.Button type="button" onClick={closePopover}>
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
      >
        <LongTextBox>
          <Tooltip
            placement="top"
            title={
              <pre
                style={{
                  fontFamily: "'Roboto Condensed', sans-serif",
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

export default TaskItemLongText;

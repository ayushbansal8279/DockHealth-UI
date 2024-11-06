import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Tooltip from 'components/common/Tooltip/Tooltip';
import TaskItemPopover from '@/app/components/task/TaskItemPopover/TaskItemPopover';
import PopoverBottomBar from '@/app/components/task/PopoverBottomBar/PopoverBottomBar';
import RichTextEditor from '@/app/components/common/RichTextEditor/RichTextEditor';
import { convertToSimpleString } from '@/app/helpers/markdown-helper.js';
import { Text, LongTextBox, Divider } from '@/app/components/task/StandardTaskItem/customFieldsTaskItemComponents/TaskItemLongText/styled.js';
import { useGridApiContext } from '@mui/x-data-grid-premium';

const CustomTextEditorWithPopover = ({
  value = '',
  openDrawer,
  readOnly = false,
  id,
  field,
}) => {
  const apiRef = useGridApiContext();
  const [rawDetails, setRawDetails] = useState(value);
  const [unformattedDetails, setUnformattedDetails] = useState(convertToSimpleString(value));

  console.log(typeof openDrawer, typeof id, typeof field);

  useEffect(() => {
    setRawDetails(value);
    setUnformattedDetails(convertToSimpleString(value));
  }, [value]);

  const handleChange = (newValue) => {
    setRawDetails(newValue);
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue,
    });
  };

  const handleBlur = (closePopover) => () => {
    if (rawDetails !== value) {
      handleChange(rawDetails);
    }
    closePopover();
  };

  const handlePopupClose = (closePopover, onClose) => () => {
    if (rawDetails !== value) {
      handleChange(rawDetails);
    }
    onClose();
    closePopover();
  };

  const handleOnClose = () => {
    if (rawDetails !== value) {
      handleChange(rawDetails);
    }
  };

  return (
    <Box width="100%" height="100%" display="flex" alignItems="center">
      <TaskItemPopover
        disabled={readOnly}
        fullWidth
        content={({ closePopover, onClose }) => (
          <Box width="550px" height="100%" alignItems="center" style={{ padding: '5px' }}>
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
            title={<pre style={{ fontFamily: "Outfit, sans-serif", fontSize: '16px', whiteSpace: 'pre-wrap', wordBreak: 'keep-all' }}>{unformattedDetails}</pre>}
          >
            <Text style={{paddingInline: '8px'}}>{unformattedDetails}</Text>
          </Tooltip>
        </LongTextBox>
      </TaskItemPopover>
    </Box>
  );
};

export default CustomTextEditorWithPopover;
import React, { useRef, useState } from 'react';
import {
  Paper,
  Popper,
  MenuItem,
  ClickAwayListener,
  ListItemText,
  Box,
  MenuList,
} from '@mui/material';
import { OutfitTypography } from 'styles/theme';
import Tooltip from 'components/common/Tooltip/Tooltip';
import zIndex from 'styles/z-index';
import palette from 'styles/palette';
import { Container } from './styled';

const AddAttachmentButton = ({ attachmentOptions = [] }) => {
  const buttonRef = useRef(null);
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (attachmentOptions.length === 0) {
      inputRef.current?.click();
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  const handleClickAway = (event) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleOptionClick = (option) => {
    if (option.label === 'Upload Local File') {
      inputRef.current?.click();
    } else {
      option.onClick?.();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file);
    }
    event.target.value = '';
  };

  return (
    <div>
      <Container ref={buttonRef} onClick={handleToggle}>
        <OutfitTypography condensed variant="h4" color="inherit">
          +
        </OutfitTypography>
      </Container>
      <Popper
        anchorEl={buttonRef.current}
        open={isOpen}
        placement="bottom-end"
        disablePortal={false}
        style={{ zIndex: zIndex.optionsMenu }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper>
            <MenuList>
              {attachmentOptions.map((option) => (
                <Tooltip key={option.name} title={option.tooltipText || ''}>
                  <div>
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                        handleOptionClick(option);
                      }}
                      disabled={option.disabled}
                    >
                      <ListItemText primary={option.label} />
                    </MenuItem>
                  </div>
                </Tooltip>
              ))}
              <Box borderBottom={`1px solid ${palette.coolGrey3}`} mb={1} />
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </Popper>
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AddAttachmentButton;

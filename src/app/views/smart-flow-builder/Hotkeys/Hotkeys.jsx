import React from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, Paper } from '@mui/material';
import {
  HotkeysContainer,
  HotkeysPopover,
  HotkeysText,
  HotkeysElements,
  Hotkey,
  HotkeyDescription,
  PopoverTitle,
} from './styled';

const Hotkeys = () => {
  return (
    <HotkeysContainer>
      <HelpOutlineIcon />
      <HotkeysText>Hotkeys</HotkeysText>
      <HotkeysPopover>
        <Paper square={false}>
          <Box p={2}>
            <PopoverTitle>Hotkeys</PopoverTitle>
            <Box m={1} />
            <HotkeysElements>
              <div>
                <Hotkey>Delete</Hotkey>
              </div>
              <div>
                <HotkeyDescription>Remove task or link</HotkeyDescription>
              </div>
              <div>
                <Hotkey>Shift</Hotkey>
              </div>
              <div>
                <HotkeyDescription>Multi-Select cards</HotkeyDescription>
              </div>
            </HotkeysElements>
          </Box>
        </Paper>
      </HotkeysPopover>
    </HotkeysContainer>
  );
};

export default Hotkeys;

import React, { useState } from 'react';
import { Popover } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import InboxHelpPanel from './InboxHelpPanel';
import { ButtonContainer, ButtonWrapper } from '../styled';

const InboxTips = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ButtonContainer sx={{ ml: 1 }}>
      <ButtonWrapper
        variant="text"
        onClick={handleClick}
        startIcon={<LightbulbIcon />}
        sx={{ color: 'white' }}
      >
        How To&apos;s
      </ButtonWrapper>
      <Popover
        style={{ zIndex: 2001 }}
        anchorEl={anchorEl}
        onClose={handleClose}
        open={open}
        anchorOrigin={{
          vertical: 'bottom',
        }}
      >
        <InboxHelpPanel />
      </Popover>
    </ButtonContainer>
  );
};

export default InboxTips;

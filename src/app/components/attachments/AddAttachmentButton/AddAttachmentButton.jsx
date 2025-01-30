import React, { useState } from 'react';
import { OutfitTypography } from 'styles/theme';
import { Container } from './styled';
import { Menu , MenuItem } from '@mui/material';

const AddAttachmentButton = ({attachmentOptions}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <Container>
      <div  onClick={handleClick}>
        <OutfitTypography condensed variant="h4" color="inherit">
          +
        </OutfitTypography>
      </div>
      {attachmentOptions.length > 0 && 
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem 
          onClick={() => handleOptionClick(attachmentOptions[0])}
          {...attachmentOptions[0]}
        >{attachmentOptions[0].label}</MenuItem>
        <MenuItem onClick={() => handleOptionClick(attachmentOptions[1])}
        {...attachmentOptions[1]}
        >{attachmentOptions[1].label}</MenuItem>
      </Menu>
      }
    </Container>
  );
};

export default AddAttachmentButton;

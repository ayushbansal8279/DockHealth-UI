import React, { useState } from 'react';
import { OutfitTypography } from 'styles/theme';
import { Container } from './styled';
import { Menu , MenuItem } from '@mui/material';

const AddAttachmentButton = ({attachmentOptions}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if(attachmentOptions.length>0){
       event.stopPropagation();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <div>
    <Container onClick={handleClick} >
      <div   >
        <OutfitTypography condensed variant="h4" color="inherit">
          +
        </OutfitTypography>
      </div>
      {attachmentOptions.length > 0 && 
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          {attachmentOptions.map((option, index) => (
            <MenuItem 
              key={index} 
              onClick={(event) => {
                handleClose();
                option.onClick?.(event);
                event.stopPropagation();
              }}
              {...(option.getRootProps ? option.getRootProps() : {})}
              disabled={option.disabled}>
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      }
    </Container>
    </div>
  );
};

export default AddAttachmentButton;

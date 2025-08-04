import React, { useEffect, useRef, useState } from 'react';
import { OutfitTypography } from 'styles/theme';
import { Container } from './styled';
import { Menu , MenuItem } from '@mui/material';

const AddAttachmentButton = ({attachmentOptions = []}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const ref = useRef(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if(attachmentOptions.length>0){
       event.stopPropagation();
    }
  };

  useEffect(() => {
  const handleClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setAnchorEl(null);
    }
  };

  document.addEventListener('mousedown', handleClick);

  return () => {
    document.removeEventListener('mousedown', handleClick);
  };
}, []);

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <div>
    <Container onClick={handleClick} ref={ref} >
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

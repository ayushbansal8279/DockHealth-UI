import React, { useState, useRef } from 'react';
import { Button, Popover } from '@material-ui/core';

const ToolbarButton = ({ buttonText, name, icon }) => {
  const [open, setOpen] = useState(false);
  const buttonReference = useRef(null);
  return (
    <>
      <Button ref={buttonReference} name={name} onClick={() => setOpen(!open)}>
        {icon}
        {buttonText}
      </Button>
      <Popover
        anchorEl={buttonReference?.current}
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        content
      </Popover>
    </>
  );
};

export default ToolbarButton;

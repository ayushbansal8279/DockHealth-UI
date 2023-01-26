import React from 'react';
import { MenuItem, Paper, Popper, ClickAwayListener } from '@mui/material';
import { useStoreState } from 'react-flow-renderer';
import { MenuItemIconWrapper, MenuList } from './styled';

const TaskLinkOptions = (props) => {
  const { anchorEl, options, onClose } = props;
  const { 2: zoom } = useStoreState((store) => store.transform);

  return (
    <Popper anchorEl={anchorEl} placement="right" open style={{ zIndex: 10 }}>
      <ClickAwayListener onClickAway={onClose}>
        <Paper
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center left',
          }}
        >
          <MenuList onClick={onClose}>
            {options
              .sort((a, b) => a.label.localeCompare(b.label))
              .map(({ key, label, icon, onClick }) => (
                <MenuItem key={key} onClick={onClick}>
                  <MenuItemIconWrapper>{icon}</MenuItemIconWrapper>
                  {label}
                </MenuItem>
              ))}
          </MenuList>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

export default TaskLinkOptions;

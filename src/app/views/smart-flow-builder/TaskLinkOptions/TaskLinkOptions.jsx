import React from 'react';
import {
  MenuItem,
  Paper,
  Popper,
  ClickAwayListener,
  Fab,
  Box,
  Tooltip,
  Grow,
} from '@mui/material';
import { useStore } from '@xyflow/react';
import { MenuItemIconWrapper, MenuList } from './styled';

const TaskLinkOptions = (props) => {
  const { anchorEl, options, onClose } = props;
  const { 2: zoom } = useStore((store) => store.transform);

  return (
    <>
      <Popper anchorEl={anchorEl} placement="right" open style={{ zIndex: 10 }}>
        <ClickAwayListener onClickAway={onClose}>
          <Paper
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center left',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                padding: 1,
                zIndex: 10,
              }}
            >
              {options
                .sort((a, b) => a.label.localeCompare(b.label))
                .map(({ key, label, icon, onClick }, index) => (
                  <Tooltip key={key} title={label} placement="right" arrow>
                    <Grow
                      in
                      style={{ transformOrigin: '0 50%' }}
                      timeout={300 + index * 500}
                    >
                      <Fab
                        key={key}
                        aria-label={label}
                        size="small"
                        onClick={onClick}
                      >
                        {icon}
                      </Fab>
                    </Grow>
                  </Tooltip>
                ))}
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

export default TaskLinkOptions;

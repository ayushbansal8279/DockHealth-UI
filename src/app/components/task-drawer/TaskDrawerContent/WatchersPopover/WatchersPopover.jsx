import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
} from '@mui/material';
import React from 'react';
import {
  Arrow,
  ArrowWrapper,
  Wrapper,
} from 'components/task-drawer/TaskDrawerContent/WatchersPopover/styled';

const WatchersPopover = ({ open, onClose, anchorEl }) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          borderRadius: 0,
          padding: '0px 9px 9px 9px',
          transform: 'translateX(-25%)',
        },
      }}
    >
      <ArrowWrapper>
        <Arrow />
      </ArrowWrapper>
      <Wrapper>
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        >
          <ListItem>
            <ListItemAvatar>
              <Avatar>A</Avatar>
            </ListItemAvatar>
            <ListItemText primary="Alley Appleton" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>B</Avatar>
            </ListItemAvatar>
            <ListItemText primary="Beta Baker" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>C</Avatar>
            </ListItemAvatar>
            <ListItemText primary="Chris Christy" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>D</Avatar>
            </ListItemAvatar>
            <ListItemText primary="Dean Dapper" />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>F</Avatar>
            </ListItemAvatar>
            <ListItemText primary="Fred Finkle" />
          </ListItem>
        </List>
      </Wrapper>
    </Popover>
  );
};

export default WatchersPopover;

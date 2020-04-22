import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React from 'react';
import { onTaskStatusChanged } from 'helpers/ga-event-helper';
import { PriorityDot } from '../common/Priority';

export default ({
  closeStatusPopover,
  setStatus,
  saveTaskStatus,
  taskIdentifier,
}) => status => {
  const { key, label, color, value } = status;

  return (
    <ListItem
      key={key}
      button
      onClick={() => {
        setStatus(status);
        closeStatusPopover();
        onTaskStatusChanged(status);
        if (taskIdentifier) {
          saveTaskStatus({ newTaskStatus: value });
        }
      }}
    >
      <ListItemIcon>
        <PriorityDot color={color} />
      </ListItemIcon>
      <ListItemText>
        <span>{label}</span>
      </ListItemText>
    </ListItem>
  );
};

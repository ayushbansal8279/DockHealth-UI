import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';

import { PriorityDot } from '../common/Priority';

export default ({
  closeStatusPopover,
  setStatus,
  saveTaskStatus,
  taskId,
}) => status => {
  const { key, label, color, value } = status;

  return (
    <ListItem
      key={key}
      button
      onClick={() => {
        setStatus(status);
        closeStatusPopover();
        if (taskId) {
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

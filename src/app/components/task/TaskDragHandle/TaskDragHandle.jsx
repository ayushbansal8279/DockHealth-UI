import React from 'react';
import ThreeDotsIcon from 'img/three-dots.svg';
import { DragHandleImg } from './styled';

const TaskDragHandle = props => {
  return <DragHandleImg src={ThreeDotsIcon} {...props} alt="Handle" />;
};

export default TaskDragHandle;

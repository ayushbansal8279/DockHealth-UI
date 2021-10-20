import React from 'react';
import AttachmentIcon from './icons/AttachmentIcon';
import CalendarIcon from './icons/CalendarIcon';
import CommentIcon from './icons/CommentIcon';
import LabelIcon from './icons/LabelIcon';
import { Wrapper, NewLabel } from './styled';

type IconType = 'comments' | 'attachments' | 'labels' | 'calendar';

interface TaskIconProps {
  type: IconType;
  height?: number;
  isHovered?: boolean;
  isActive?: boolean;
  isNew?: boolean;
}

const TaskIcon: React.FC<TaskIconProps> = ({
  type,
  height = 22,
  isHovered,
  isActive,
  isNew,
}) => (
  <Wrapper isHovered={isHovered} isActive={isActive}>
    {
      {
        comments: <CommentIcon height={height || 22} />,
        attachments: <AttachmentIcon height={height || 22} />,
        labels: <LabelIcon height={height || 22} />,
        calendar: <CalendarIcon height={height || 22} />,
      }[type]
    }
    <NewLabel isHidden={!isNew || !isActive} />
  </Wrapper>
);

export default TaskIcon;

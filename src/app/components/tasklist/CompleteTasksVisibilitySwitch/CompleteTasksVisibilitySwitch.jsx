import React from 'react';
import palette from 'styles/palette';
import CompleteTasksVisibleIcon from 'img/complete-tasks-visible-icon.svg';
import CompleteTasksHiddenIcon from 'img/complete-tasks-hidden-icon.svg';
import ToolbarButton from '@/app/components/tasklist/list-toolbar-buttons/ToolbarButton/ToolbarButton';
import { VisibilityImg } from './styled';

const CompleteTasksVisibilitySwitch = (props) => {
  const { visible, onChange, iconColorFilterActive } = props;
  return (
    <ToolbarButton
      color={visible ? palette.coolGrey1 : null}
      icon={
        <VisibilityImg
          src={visible ? CompleteTasksVisibleIcon : CompleteTasksHiddenIcon}
          alt={visible ? 'complete-tasks-visible' : 'complete-tasks-hidden'}
          iconColorFilterActive={iconColorFilterActive}
        />
      }
      onClick={() => onChange(!visible)}
    >
      Completed Tasks
    </ToolbarButton>
  );
};

export default CompleteTasksVisibilitySwitch;

import React from 'react';
import palette from 'styles/palette';
import CompleteTasksVisibleIcon from 'img/complete-tasks-visible-icon';
import CompleteTasksHiddenIcon from 'img/complete-tasks-hidden-icon';
import ToolbarButton from 'components/tasklist/ToolbarButton/ToolbarButton';
import { VisibilityImg } from './styled';

const CompleteTasksVisibilitySwitch = props => {
  const { visible, onChange, iconColorActive } = props;
  return (
    <ToolbarButton
      color={visible ? palette.coolGrey1 : null}
      icon={
        <VisibilityImg
          src={visible ? CompleteTasksVisibleIcon : CompleteTasksHiddenIcon}
          alt={visible ? 'complete-tasks-visible' : 'complete-tasks-hidden'}
          iconColorActive={iconColorActive}
        />
      }
      onClick={() => onChange(!visible)}
    >
      Completed Tasks
    </ToolbarButton>
  );
};

export default CompleteTasksVisibilitySwitch;

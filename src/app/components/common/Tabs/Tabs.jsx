import React from 'react';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import { TabsContainer, TabButton } from './styled';

const Tab = ({ label, isSelected, onSelectTab }) => (
  <TabButton onClick={onSelectTab} isSelected={isSelected}>
    {label}
  </TabButton>
);

const Tabs = ({ config, completedTasksAmount }) => {
  return (
    <TabsContainer>
      {config?.map(({ shouldRender, key, ...tab }) => {
        return (
          shouldRender() &&
          (key !== TaskListTabName.COMPLETE || completedTasksAmount > 0) && (
            <Tab key={key} {...tab} />
          )
        );
      })}
    </TabsContainer>
  );
};

export default Tabs;

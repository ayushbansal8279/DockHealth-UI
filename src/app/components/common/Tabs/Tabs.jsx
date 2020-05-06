import React from 'react';
import { TabsContainer, TabButton } from './styled';

const Tab = ({ label, isSelected, onSelectTab }) => (
  <TabButton onClick={onSelectTab} isSelected={isSelected}>
    {label}
  </TabButton>
);

const Tabs = ({ config }) => {
  return (
    <TabsContainer>
      {config?.map(
        ({ shouldRender, ...tab }) => shouldRender() && <Tab {...tab} />,
      )}
    </TabsContainer>
  );
};

export default Tabs;

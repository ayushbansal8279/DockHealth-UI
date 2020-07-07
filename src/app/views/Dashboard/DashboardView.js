import React from 'react';
import { useSelector } from 'react-redux';
import DashboardSidebar from './DashboardSidebar/DashboardSidebar';
import DashboardContent from './DashboardContent/DashboardContent';
import {
  DashboardViewWrapper,
  DashboardSidebarWrapper,
  DashboardContentWrapper,
} from './styled';

const DashboardView = () => {
  const isTaskDrawerOpen = useSelector(store => store.taskDrawerState.open);
  return (
    <DashboardViewWrapper>
      <DashboardSidebarWrapper isHidden={isTaskDrawerOpen}>
        <DashboardSidebar />
      </DashboardSidebarWrapper>
      <DashboardContentWrapper hasRightPadding={isTaskDrawerOpen}>
        <DashboardContent />
      </DashboardContentWrapper>
    </DashboardViewWrapper>
  );
};

export default DashboardView;

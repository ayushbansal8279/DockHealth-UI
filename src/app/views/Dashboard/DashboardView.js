import React from 'react';
import DashboardSidebar from './DashboardSidebar/DashboardSidebar';
import DashboardContent from './DashboardContent/DashboardContent';
import {
  DashboardViewWrapper,
  DashboardSidebarWrapper,
  DashboardContentWrapper,
} from './styled';

const DashboardView = () => {
  return (
    <DashboardViewWrapper>
      <DashboardSidebarWrapper>
        <DashboardSidebar />
      </DashboardSidebarWrapper>
      <DashboardContentWrapper>
        <DashboardContent />
      </DashboardContentWrapper>
    </DashboardViewWrapper>
  );
};

export default DashboardView;

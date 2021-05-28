import Spacing from 'components/common/Spacing';
import React from 'react';
import palette from 'styles/palette';
import { NameLoader, StatusFlag, StatusItemWrapper } from './styled';

const WorkflowStatusItemLoader = () => {
  return (
    <StatusItemWrapper>
      <StatusFlag color={palette.skeletonLoader} />
      <Spacing horizontal={3} />
      <NameLoader />
    </StatusItemWrapper>
  );
};

export default WorkflowStatusItemLoader;

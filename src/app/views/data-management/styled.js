import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const DataManagementTabsContainer = styled(Box)``;

export const DataManagementDetailsContainer = styled(Box)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const ToolbarStack = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
  justify-content: space-between;
`;

export const TabContent = styled(Box)`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 150px);
  padding: 16px;
  min-height: 0;
`;

export const DataGridContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 0;
  margin-block: 16px 32px;
  overflow: hidden;
`;

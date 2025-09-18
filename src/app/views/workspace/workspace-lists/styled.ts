import styled from 'styled-components';

export const WorkspaceListsContainer = styled.div`
  width: 100%;
  max-width: 1179px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 48px;
  height: calc(100vh - 150px);
`;

export const WorkspaceListsHeader = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const WorkspaceListsTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  display: flex;
  justify-content: center;
  flex: 1;
`;

export const ListLoaderContainer = styled.div`
  margin: 38px auto 16px auto;
`;
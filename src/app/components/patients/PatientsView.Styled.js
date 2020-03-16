import styled from 'styled-components';

export const PatientsViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 100%;
`;

export const PatientsListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const FadeContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  padding-top: 100px;
`;

export const SideClickListener = styled.div`
  flex: 1;
`;

export const SidebarInnerContainer = styled.div`
  max-width: 100%;
  position: sticky;
  top: 0;
`;

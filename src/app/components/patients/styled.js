import styled from 'styled-components';

export const PatientsViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
`;

export const PatientsListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const SideClickListener = styled.div`
  flex: 1;
`;

export const SidebarInnerContainer = styled.div`
  max-height: ${props => props.height ?? 0}px;
  max-width: 100%;
  overflow-y: auto;
  position: sticky;
  scrollbar-color: transparent transparent;
  scrollbar-width: none;
  top: 0;

  &::-webkit-scrollbar {
    display: none;
  }
`;

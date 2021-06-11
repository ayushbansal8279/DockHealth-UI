import styled from 'styled-components';
import spacing from 'styles/spacing';

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

export const PatientsListDescription = styled.div`
  font-size: 12px;
  font-weight: 400;
`;

export const InputWrapper = styled.div`
  width: 100%;
  max-width: 1147px;
  margin: 0 auto;
  padding: 0 ${spacing.huge};
  padding-top: ${({ hasValue }) => (hasValue ? 32 : 200)}px;
  transition: padding 0.3s ease-out;
`;

export const SearchHelperText = styled.p`
  max-width: 700px;
  margin: 0 auto;
  padding-top: ${spacing.huge};
  text-align: center;
  font-family: 'Montserrat', sans-serif;
`;

import styled from 'styled-components';
import palette from 'styles/palette';

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

export const RefineSearchText = styled.p`
  max-width: 700px;
  margin: 0 auto;
  padding-top: 10px;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  color: ${palette.oPlusRed};
`;

export const BulkEditSectionContainer = styled.div`
  width: 90%;
  margin-left: auto;
  margin-right: auto;
`;

export const TaskTemplateApplicatorContainer = styled.div`
  margin-bottom: 60px;
  justify-content: center;
  display: flex;
  padding-top: 10px;
`;

export const ContentWrapper = styled.div`
  padding: 0px 20px 0 0;
  max-width: 360px;
  width: 100%;
  box-sizing: border-box;
`;

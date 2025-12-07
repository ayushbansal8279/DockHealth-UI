import styled from 'styled-components';
import { Typography, Button } from '@mui/material';
import { fontSizes } from '../../styles/font';
import palette, { typography } from '../../styles/palette';
import spacing from '@/app/styles/spacing';
import { Delete, Edit } from '@mui/icons-material';

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background-color: ${palette.whiteSmoke};
  min-height: calc(100vh - 120px);
`;

export const AddTaskButtonWrapper = styled(Button)`
  && {
    border-radius: 4px;
    background-color: ${palette.newDarkBlue};
  }
  & .MuiSvgIcon-root > path {
    fill: ${palette.white};
  }
  height: 32px;
  width: 150px;
`;

export const AddTaskButtonLabel = styled(Typography)`
  &&& {
    &.MuiTypography-root {
      color: ${palette.white};
      display: inline-block;
      margin-left: ${spacing.tiny};
      text-transform: none;
      font-size: 14px;
      font-weight: 500;
      line-height: 11.19px;
      text-align: center;
      margin-right: 5px;
    }
  }
`;

export const IntegrationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const HeaderBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const HeaderTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-left: 16px;
`;

export const NoIntegrationsText = styled(Typography)`
  text-align: center;
  color: ${palette.coolGrey1};
  padding: 32px 0;
`;

export const DetailItem = styled.div`
  margin-bottom: 6px;
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 8px;
  align-items: flex-start;
`;

export const StrongLabel = styled.div`
  font-size: ${fontSizes.smallPlus};
  color: ${palette.midnightBlue};
  font-weight: 600;
  margin-top: 2px;
`;

export const IntegrationDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  font-family: ${typography.text};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const FieldsColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const StatusIndicator = styled.div<{ isActive?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  background-color: ${(props) =>
    props.isActive ? palette.memberGreen : '#dc3545'};
  color: ${palette.white};
  border-radius: 4px;
  font-size: 12px;
  letter-spacing: 0.5px;
`;

export const EditIcon = styled(Edit)`
  cursor: pointer;
  color: ${palette.coolGrey1};
  font-size: 20px;

  &:hover {
    color: ${palette.newDarkBlue};
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IntegrationContainerBox = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
`;

export const IntegrationHeaderBox = styled.div`
  margin-right: 8px;
`;

export const IntegrationSummaryBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const IntegrationTitleBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const IntegrationMetadataBox = styled.div`
  display: flex;
  gap: 24px;
  font-size: 0.875rem;
  color: ${palette.coolGrey1};
  margin-top: 4px;
`;

export const IntegrationDetailsBox = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

export const IntegrationFooterBox = styled.div`
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #fafafa;
  margin: 16px -16px -16px -16px;
  padding: 12px 16px;
`;

export const IntegrationFooterMetadataBox = styled.div`
  display: flex;
  gap: 24px;
  font-size: 0.875rem;
  color: ${palette.coolGrey1};
`;

export const IntegrationFooterActionsBox = styled.div`
  display: flex;
  gap: 8px;
`;

export const LoadingBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

export const LoadingText = styled(Typography)`
  margin-left: 16px;
`;

export const AccordionSx = {
  mb: 2,
  boxShadow: 'none',
  border: '1px solid #e0e0e0',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: '0 0 16px 0',
  },
};

export const AccordionSummarySx = {
  minHeight: '64px',
  '&.Mui-expanded': {
    minHeight: '64px',
  },
};

export const AccordionDetailsSx = {
  pt: 0,
};

export const IntegrationTitleTypography = styled(Typography)`
  font-weight: 600;
  font-size: 1.25rem;
`;

export const IntegrationDescriptionTypography = styled(Typography)`
  margin-left: 0;
`;

export const ValueText = styled.span`
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.small};
  line-height: 1.4;
`;

export const FieldValue = styled.div`
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.small};
  line-height: 1.4;
  word-break: break-all;
  font-family: monospace;
  background-color: ${palette.coolGrey4};
  padding: 4px 8px;
  border-radius: 4px;
  margin-top: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${palette.coolGrey3};
  }
`;

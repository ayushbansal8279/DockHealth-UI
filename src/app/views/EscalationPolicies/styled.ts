import styled from 'styled-components';
import { Typography, Card, Button, Box, Alert } from '@mui/material';
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
  width: 120px;
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

export const PolicyListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const HeaderBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 24px;
`;

export const NoPoliciesText = styled(Typography)`
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

export const DetailItem1 = styled.div`
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
  margin-top:2px;
`;







export const PolicyItemDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  font-family: ${typography.text};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const ScopeAndTrigger = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FiltersAndActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TriggerBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background-color: ${palette.lightOceanBlue};
  border-radius: 6px;
  font-size: ${fontSizes.small};
  font-weight: 500;
  color: ${palette.newDarkBlue};
  margin-bottom: 6px;
  width: fit-content;
  text-transform: capitalize;
`;


export const FilterBulletList = styled.ul`
  margin: 2px 0 0 0;
  padding-left: 12px;
  list-style-type: disc;
  
  li {
    color: ${palette.coolGrey1};
    font-size: ${fontSizes.small};
    margin-bottom: 1px;
    line-height: 1.3;
  }
`;

export const FilterBulletItem = styled.li`
  /* Additional styling if needed */
`;

export const ActionBulletList = styled.ul`
  margin: 2px 0 0 0;
  padding-left: 12px;
  list-style-type: disc;
  
  li {
    color: ${palette.coolGrey1};
    font-size: ${fontSizes.small};
    margin-bottom: 8px;
    line-height: 1.5;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
`;

export const ActionBulletItem = styled.li`
  font-weight: 500;
  
  ul {
    margin-top: 4px;
    margin-bottom: 0;
    padding-left: 20px;
    list-style-type: circle;
    
    li {
      font-weight: 400;
      margin-bottom: 2px;
      font-size: ${fontSizes.small};
      line-height: 1.4;
      color: ${palette.coolGrey1};
    }
  }
`;


export const StatusIndicator = styled.div<{ isActive?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  background-color: ${props => props.isActive ? palette.memberGreen : '#dc3545'};
  color: ${palette.white};
  border-radius: 4px;
  font-size: 12px;
  letter-spacing: 0.5px;
`;

export const EditIcon = styled(Edit)`
  cursor: pointer;
  color: ${palette.coolGrey1};
  font-size: 20px;

`;

export const DeletIcon = styled(Delete)`
  cursor: pointer;
  color: ${palette.coolGrey1};
  font-size: 20px;

`;
  
export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PolicyContainerBox = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
`;

export const PolicyHeaderBox = styled.div`
  margin-right: 8px;
`;

export const PolicySummaryBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const PolicyTitleBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const PolicyMetadataBox = styled.div`
  display: flex;
  gap: 24px;
  font-size: 0.875rem;
  color: ${palette.coolGrey1};
  margin-top: 4px;
`;

export const PolicyDetailsBox = styled.div`
  display: flex;
  justify-content: space-between;
`;


export const PolicyFooterBox = styled.div`
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fafafa;
  margin: 16px -16px -16px -16px;
  padding: 12px 16px;
`;

export const PolicyFooterMetadataBox = styled.div`
  display: flex;
  gap: 24px;
  font-size: 0.875rem;
  color: ${palette.coolGrey1};
`;

export const PolicyFooterActionsBox = styled.div`
  display: flex;
  gap: 8px;
`;

export const LoadingBox = styled.div`
  display: flex;
  justify-content: center;
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

export const PolicyTitleTypography = styled(Typography)`
  font-weight: 600;
  font-size: 1.25rem;
`;

export const PolicyDescriptionTypography = styled(Typography)`
  margin-left: 0;
`;

export const ErrorAlert = styled(Alert)`
  margin-bottom: 16px;
`;
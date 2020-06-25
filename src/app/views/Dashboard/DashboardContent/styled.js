import styled from 'styled-components';
import { Link } from 'react-router';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontWeights, fontSizes } from 'styles/font';

export const DashboardContainer = styled.div`
  height: 100%;
  overflow-y: scroll;
`;

export const DashboardTasksGroupContainer = styled.div`
  padding: 28px 55px 68px; // per design
`;

export const DashboardTasksGroupLabel = styled.div`
  font-size: ${fontSizes.regularPlus};
  color: ${palette.mediumGrey};
  font-weight: ${fontWeights.regularPlus};
  padding-bottom: ${spacing.large};
  border-bottom: 1px solid ${palette.coolGrey2};
  width: 100%;
`;

export const DashboardTasksGroupList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CircleIcon = styled.img`
  cursor: ${({ isClickable }) => (isClickable ? 'pointer' : 'initial')};
  margin-right: ${spacing.smallPlus};
`;

export const OverdueBar = styled.div`
  background-image: linear-gradient(29deg, #ec4f3e 53%, #fb7c06 115%);
  padding: 2px 10px; // per design
  display: flex;
  justify-content: flex-end;
  border-radius: 81px; // per design
  font-size: ${fontSizes.tiny};
  color: white;
  height: fit-content;
`;

export const PriorityHoverIcon = styled.img`
  opacity: 0;
`;

export const DashboardTaskItemContainer = styled.div`
  display: flex;
  height: 70px;
  align-ttems: center;
  width: 100%;
  position: relative;

  &:hover {
    & ${PriorityHoverIcon} {
      opacity: 1;
  }
`;

export const DashboardTaskItemRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

export const DashboardTaskItemDescription = styled.div`
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.bold};
  min-width: 400px;
`;

export const DashboardTaskItemParentTaskLabel = styled.div`
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey2};

  & > span {
    color: ${palette.brightBlue};
  }
`;

export const DashboardTaskItemRightSide = styled.div`
  max-width: 240px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const DashboardTaskItemListLink = styled(Link)`
  color: ${palette.brightBlue};
  font-size: ${fontSizes.small};
`;

export const PrioritySwitch = styled.button`
  position: absolute;
  top: 50%;
  left: -24px;
  transform: translateY(-50%);
  cursor: pointer;
`;

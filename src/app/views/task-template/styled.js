import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontSizes } from 'styles/font';

// eslint-disable-next-line import/prefer-default-export
export const TaskTemplateViewContainer = styled.div`
  text-align: right;
  padding: ${spacing.giga} 42px;
`;

export const SearchWrapper = styled.div`
  width: 600;
  transition: width 0.25s ease-out;
`;

export const SearchAndFilterContainer = styled.div`
  display: flex;
`;

export const UpgradePlanPopupHeader = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
`;

export const PremiumBadgeContainer = styled.div`
  background-color: ${palette.brightBlue};
  border-radius: 27px;
  padding: ${spacing.smallPlus};
  font-size: ${fontSizes.small};
  color: ${palette.white};
`;

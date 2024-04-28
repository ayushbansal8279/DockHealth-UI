import styled from 'styled-components';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';

export const CustomizeImg = styled.img`
  width: 16px;
  height: 16px;
  ${({ iconColorFilterActive }) =>
    iconColorFilterActive
      ? `filter: ${iconColorFilterActive}; `
      : // : 'filter: invert(60%) sepia(60%) saturate(1790%) hue-rotate(348deg) brightness(100%) contrast(88%);'
        'filter: invert(100%) saturate(0%) brightness(100%);'}
`;

export const PopoverContainer = styled.div`
  background-color: ${palette.white};
  min-width: 360px;
  max-width: 360px;
  box-shadow: 0px 4px 11px grey;
  min-height: 600px;
  max-height: 600px;
  overflow-x: hidden;
  overflow-y: visible;
`;

export const PlusIcon = styled.div`
  padding: 0 2px;
`;

export const UpgradePlanPopupHeader = styled.div`
  display: flex;
  font-family: inherit;
`;

export const Spacer = styled.hr`
  margin: 0;
  width: 100%;
  border-color: ${palette.coolGrey3};
  height: 0.5px;
`;

export const UpgradePlanContainer = styled.div`
  display: flex;
  padding: 0 ${spacing.regular} ${spacing.huge} ${spacing.regular};
  justify-content: center;
  width: 310px;
`;

import spacing from '@/app/styles/spacing';
import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';
import TaskAutomationComplete from 'img/task-automation-complete.svg';
import TaskAutomationPending from 'img/task-automation-pending.svg';

export const ContextMenu = styled.div`
  position: absolute;
  left: 20px;
  top: 20px;
  height: 270px;
  width: 160px;
  padding: 16px;
  background-color: ${palette.white};
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.15);
  z-index: 10;
`;

export const ElementsSidebar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 190px;
  height: 100%;
  padding: 32px 16px;
  box-shadow: 0px 2.13948px 6.41845px rgba(0, 0, 0, 0.25);
  background: ${palette.white};
  font-family: 'Outfit', sans-serif;
  font-size: ${fontSizes.smallPlus};
  color: ${palette.mediumGrey};
  text-align: left;
  user-select: none;
`;

export const SidebarTitle = styled.p`
  margin-bottom: 0;
  font-size: inherit;
  font-weight: ${fontWeights.bold};
  text-transform: uppercase;
  user-select: none;
`;

export const ElementButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% + 32px);
  padding: 16px;
  margin: 0 -16px;
  transition: background-color 0.3s linear;

  &:hover {
    background-color: ${palette.brightBlueWithAlpha};
  }
`;

export const ElementIconBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 32px 0 0;
  height: 32px;
  border-radius: 5px;
  background-color: ${palette.brightBlue};
  color: ${palette.white};
`;

export const ElementDescription = styled.p`
  display: block;
  flex: 1;
  margin-left: 12px;
  margin-bottom: 0;
  font-size: inherit;
  font-weight: inherit;
  font-weight: ${fontWeights.regular};
  color: inherit;
  text-transform: uppercase;
  text-align: left;
`;

export const TaskElementIcon = styled.div`
  width: 16px;
  height: 11px;
  border: 1px solid ${palette.white};
  border-radius: 3px;
  color: inherit;
`;

export const AutomationTaskIcon = styled.div`
  width: 25px;
  height: 30px;
  border-radius: 3px;
  color: inherit;
  background-image: url(${TaskAutomationPending});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  fill:  ${palette.white};
`;

export const BuilderHeader = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  max-width: 100%;
  display: flex;
  padding: 16px;
  align-items: center;
  z-index: 5;
  user-select: none;
`;
export const EditIconWrapper = styled.div`
  opacity: 0;
  color: ${palette.coolGrey2};
  margin-left: 8px;
`;

export const BuilderHeaderText = styled.p`
  display: flex;
  align-items: center;
  margin-bottom: 0;
  font-family: inherit;
  font-size: ${fontSizes.large};
  color: ${({ color }) => color || palette.brightBlue};

  &:hover {
    text-decoration: underline;
    ${EditIconWrapper} {
      opacity: 1;
    }
  }

  &:last-of-type {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const SidebarDivider = styled.hr`
  border-color: ${palette.coolGrey3};
  margin: 24px 0;
`;

export const AutoAlignButton = styled.button`
  display: block;
  margin: 0 auto;
  padding: 6px 12px;
  border-radius: 14px;
  color: ${palette.white};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regular};
  background: ${palette.darkBlue};
`;

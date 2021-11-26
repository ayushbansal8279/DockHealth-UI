import styled, { keyframes } from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

const LightenedTaskContainer = keyframes`
0% { background-color: ${palette.brightBlueWithAlpha}; }
100% { background-color: ${palette.white}; }
`;

export const TaskTemplateContainer = styled.div`
  width: 100%;
  margin-bottom: ${spacing.smallPlus};
  text-align: left;
  animation: ${({ highlighted }) =>
    highlighted ? LightenedTaskContainer : 'none'};
  animation-duration: 3.5s;
  background-color: ${palette.white};
  animation-timing-function: ease-in-out;
`;

export const TaskTemplateHeader = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  grid-template-rows: 30px;
  grid-column-gap: ${spacing.tiny};
  align-items: center;
  width: 100%;
  padding: 2px ${spacing.smallPlus};
  border: 1px solid ${palette.coolGrey3};
  font-family: 'Roboto', sans-serif;
  font-size: ${fontSizes.smallPlus};
`;

export const NameInput = styled.input`
  grid-column: 2;
  margin-bottom: 0;
  padding: ${spacing.small};
  color: ${({ error }) => (error ? palette.error : palette.mediumGrey)};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background-color: transparent;
  border: 1px solid
    ${({ error }) => (error ? palette.error : palette.coolGrey2)};
  border-radius: 5px;
  background: ${palette.coolGrey4};
  font-weight: ${fontWeights.regular};

  &[readonly] {
    background-color: transparent;
    cursor: pointer;
    outline: none;
    border: none;
  }

  &:focus {
    outline: none;
  }
`;

export const HeaderChildrenContainer = styled.div`
  grid-column: 3;
`;

export const MenuContainer = styled.div`
  grid-column: 4;
  overflow: hidden;
  color: ${palette.coolGrey2};
`;

export const Spacer = styled.div`
  grid-column: 4;
`;

export const FolderIcon = styled.img`
  grid-column: 1;
`;

export const FolderIconContainer = styled.div`
  display: flex;
  width: 26px;
  justify-content: center;
  margin-left: ${spacing.small};
  grid-column: 1;
`;

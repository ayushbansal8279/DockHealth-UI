import styled from 'styled-components';

import palette, { opacify } from 'styles/palette';
import { Chip, Divider } from '@material-ui/core';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const TaskDrawerContainer = styled.div`
  background-color: ${palette.white};
  box-shadow: 0 0 ${({ open }) => (open ? 0.5 : 0)}rem
    ${opacify(palette.black, 0.2)};
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0rem;
  position: fixed;
  right: 0;
  top: 0;
  -webkit-transform: translateX(${({ open }) => (open ? 0 : 100)}%);
  transform: translateX(${({ open }) => (open ? 0 : 100)}%);
  -webkit-transition: -webkit-transform 100ms ease;
  transition: transform 100ms ease;
  will-change: transform;
  width: 756px;
  z-index: 1101;
`;

export const TaskDrawerBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  z-index: 98;
`;

export const MemberAdornmentContainer = styled.div`
  align-self: flex-end;
  margin-bottom: 0;
  margin-right: 1rem;
`;

export const HiddenFieldContainer = styled.div`
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
`;

export const FormSectionDivider = styled.div`
  background-color: ${props =>
    props.active ? palette.vividPink : palette.unknownGrey2};
  height: ${props => (props.shown ? '0.0625rem' : 0)};
  position: relative;
  transition: background-color 0.25s ease-out;
  width: 100%;

  ${props => props.condensed && 'margin: 0 0.5rem;'}
`;

export const AutoSaveContainer = styled.div`
  height: ${props => (props.visible ? 2 : 0)}rem;
  left: 0;
  overflow: hidden;
  pointer-events: none;
  position: absolute;
  top: 0;
  transition: height 0.25s ease-out;
  width: 100%;
  text-align: center;
  margin-top: 10px;
`;

export const AutoSaveChip = styled(Chip)`
  && {
    background-color: ${palette.accentYellow};
    color: ${palette.white};
    border: 0;
    font-weight: bold; 
    font-size: 16px;
    left:
    top: 0;
    padding: 0 0.25rem;
    transition: top 0.25s ease-out;
    transform: translateX(0%);
  }
`;

export const AutoSaveLabel = styled.div`
  align-items: center;
  background-color: ${palette.vividPink};
  border-radius: 0 0 0.5rem 0.5rem;
  color: ${palette.white};
  display: flex;
  height: 1.5rem;
  left: 50%;
  padding: 0 0.75rem;
  pointer-events: none;
  position: absolute;
  top: ${props => (props.visible ? 0 : -1.5)}rem;
  transition: top 0.25s ease-out;
  transform: translateX(-50%);
`;

export const rowHeight = 'fit-content';

export const styleTaskDrawerContainer = {
  padding: '1rem 0rem 0.5rem  0rem',
};

export const styleFullRow = {
  padding: '1rem 2rem',
  height: rowHeight,
};

export const styleFullRowThin = {
  padding: '0rem 2rem',
  height: rowHeight,
};

export const styleFirstRow = {
  padding: '0rem 2rem 0.5rem 2rem',
};

export const styleLastRow = {
  padding: '0rem 2rem 1rem 2rem',
};

export const styleEmailRow = {
  padding: '0 2rem',
  backgroundColor: palette.blueGrey,
};

export const styleCommentRow = {
  padding: '1rem 2rem',
};

export const styleLeftColumn = {
  padding: '1rem 1rem 1rem 2rem',
  height: rowHeight,
};

export const styleRightColumn = {
  padding: '1rem 2rem 1rem 1rem',
  height: rowHeight,
};

export const DescriptionContainer = styled.div`
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
  color: ${palette.mediumGrey};
  transition: all 0.2s ease-out;

  border-bottom: 1px solid
    ${({ isFocused }) => (isFocused ? palette.coolGrey1 : 'transparent')};

  ${({ hasError }) => hasError && `border-color: ${palette.error};`}
`;

export const DescriptionTextContainer = styled.div`
  ${({ isCrossed }) => isCrossed && `text-decoration: line-through;`}
`;

export const DescriptionLabel = styled.label`
  display: block;
  margin-bottom: ${spacing.small};
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey1};
  text-transform: uppercase;

  & > span {
    text-transform: none;
  }
`;

export const DescriptionError = styled.p`
  margin-bottom: 0;
  color: ${palette.error};
  font-size: ${fontSizes.smallPlus};
  font-family: 'Roboto Condensed', sans-serif;
`;

export const ParentTaskButton = styled.button`
  cursor: pointer;
`;

export const ParentTaskDescription = styled.p`
  color: ${palette.brightBlue};
  font-weight: ${fontWeights.bold};
  font-size: ${fontSizes.regular};
  margin-bottom: 0;
`;

export const ParentTaskDescriptionPlaceholder = styled.div`
  width: 50%;
  height: 20px;
  margin: 2px 0;
  background: ${palette.coolGrey3};
`;

export const CompletedByLabel = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey1};
`;

export const TaskDrawerDivider = styled(Divider)`
  && {
    width: 100%;
    background-color: ${palette.blueOcean};
    opacity: 0.3;
  }
`;

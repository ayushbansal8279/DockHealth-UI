import React from 'react';
import styled from 'styled-components';

import palette, { opacify } from 'styles/palette';
import { RobotoTypography } from 'styles/theme';
import { List, Chip } from '@material-ui/core';
import { Close } from '@material-ui/icons';

const FONT_FAMILY = '"Roboto Condensed", sans-serif';

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
  top: ${({ top }) => top}px;
  transform: translateX(${({ open }) => (open ? 0 : 100)}%);
  transition: all 0.25s ease-out;
  width: 756px;
  z-index: 100;
`;

export const TaskDrawerBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  z-index: 99;
`;

export const AdornmentContainer = styled.div`
  align-items: center;
  align-self: flex-end;
  color: ${palette.orange};
  display: flex;
  justify-content: center;
  margin-bottom: 0.3rem;
  width: 2ch;
`;

export const EndAdornmentContainer = styled.div`
  align-items: center;
  align-self: flex-end;
  color: ${palette.orange};
  display: flex;
  justify-content: center;
  margin-bottom: 0.7rem;
  width: 2ch;
`;

export const PatientLabelContainer = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 1fr 4rem 6rem;
  width: 100%;

  > * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const MemberLabelContainer = styled.div`
  align-items: center;
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 1fr 30px;
  width: 100%;

  > * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const MemberAdornmentContainer = styled.div`
  align-self: flex-end;
  margin-bottom: 0.5rem;
  margin-right: 1rem;
`;

export const HiddenFieldContainer = styled.div`
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
`;

export const EnvelopeIconContainer = styled.div`
  fill: ${palette.white};
`;

export const CondensedH4 = ({ ...props }) => (
  <RobotoTypography condensed variant="h4" {...props} />
);

export const CondensedH5 = ({ ...props }) => (
  <RobotoTypography condensed variant="h5" {...props} />
);

export const BlockButton = styled.button`
  display: block;
  text-align: left;
  width: 100%;
`;

export const HorizontalLabel = styled.span`
  color: ${palette.coolGrey2};
  fontfamily: ${FONT_FAMILY};
  margin-right: 5px;
  & > * {
    font-size: 1rem;
    margin-right: 5px;
  }
`;

export const FiledInSelect = styled.div`
  align-items: center;
  cursor: ${props => (props.enableDropDown ? 'pointer' : '')};
  display: inline-flex;
  flex-flow: row nowrap;
  width: 200px;
  & > * {
    font-size: 1rem;
    margin-left: 6px;
  }
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

export const StyledList = styled(List)`
  max-height: 12.5rem;
  overflow-y: auto;
`;

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

export const AdornmentClear = styled(Close)`
  && {
    width: 20px;
    height: 20px;
    color: ${palette.coolGrey2};
    cursor: pointer;
  }
`;

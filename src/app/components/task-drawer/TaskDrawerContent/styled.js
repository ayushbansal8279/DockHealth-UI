/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from 'styled-components';
import palette from 'styles/palette';
import { Divider } from '@material-ui/core';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const TaskDrawerContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0;
  text-align: left;
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.15);
  background-color: ${palette.white};
  overflow-y: auto;
  overflow-x: hidden;
`;

export const TaskDrawerBackground = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100%;
  z-index: -1;
`;

export const rowHeight = 'fit-content';

export const styleTaskDrawerContainer = {
  padding: '1rem 0rem 0.5rem  0rem',
};

export const styleNoPaddingRow = {
  padding: '0rem 0rem',
  height: rowHeight,
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

export const ReferenceParentButton = styled.button`
  cursor: pointer;
`;

export const ReferenceParentName = styled.p`
  margin-bottom: 0;
  text-align: left;
  color: ${palette.brightBlue};
  font-weight: ${fontWeights.bold};
  font-size: ${fontSizes.regular};
`;

export const ReferenceParentNamePlaceholder = styled.div`
  width: 50%;
  height: 20px;
  margin: 2px 0;
  background: ${palette.coolGrey3};
`;

export const TaskDrawerDivider = styled(Divider)`
  && {
    width: 100%;
    background-color: ${palette.coolGrey2};
    opacity: 0.3;
  }
`;

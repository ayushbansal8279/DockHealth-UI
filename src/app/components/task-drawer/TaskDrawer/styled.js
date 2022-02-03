/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from 'styled-components';
import React from 'react';
import { motion } from 'framer-motion/dist/framer-motion';
import palette, { opacify } from 'styles/palette';
import { Divider, InputLabel } from '@material-ui/core';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const AnimatedContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 756px;
  z-index: 1101;
`;

export const TaskDrawerContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0;
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.15);
  background-color: ${palette.white};
  overflow-y: auto;
  overflow-x: hidden;
`;

export const TextEditorInputLabel = styled(
  ({ richTextEnabled, hasError, ...props }) => <InputLabel {...props} />,
)`
  margin-bottom: ${({ richTextEnabled, focused }) =>
    richTextEnabled && focused ? '20px' : '0px'};
`;

export const TextEditorFormStyleContainer = styled.div`
  background-color: #f7fafb !important;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 10px;
  border-bottom: ${({ focused, hasError }) => {
    if (!hasError) {
      return focused ? '2px solid #0ca1c7' : '1px solid #8492a4';
    }
    return '2px solid #e40909';
  }};
`;
export const TaskDrawerBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  z-index: 98;
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

export const DescriptionLabel = styled.label`
  display: block;
  margin-bottom: ${spacing.small};
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.small};
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey1};
  text-transform: uppercase;

  & > span {
    text-transform: none;
  }
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
    background-color: ${palette.coolGrey2};
    opacity: 0.3;
  }
`;

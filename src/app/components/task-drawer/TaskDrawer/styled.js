import styled from 'styled-components';

import palette, { opacify } from 'styles/palette';
import { Divider, InputLabel } from '@material-ui/core';
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
  text-align: left;
  z-index: 1101;
`;

export const TextEditorInputLabel = styled(InputLabel)`
  margin-bottom: ${({ richTextEnabled, focused }) =>
    richTextEnabled && focused ? '20px' : '0px'};
`;

export const TextEditorFormStyleContainer = styled.div`
  width: 100%;
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

export const styleFullRow = {
  padding: '1rem 2rem',
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

export const DetailsContainer = styled.div`
  padding: 1rem 2rem;
  height: fit-content;
`;

export const ParentTask = styled.div`
  padding: 1rem 2rem;
  height: fit-content;
`;

export const DescriptionTextContainer = styled.div`
  ${({ isCrossed }) => isCrossed && `text-decoration: line-through;`}
`;

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

export const DescriptionError = styled.p`
  margin-bottom: 0;
  color: ${palette.error};
  font-size: ${fontSizes.smallPlus};
  font-family: 'Roboto Condensed', sans-serif;
`;

export const ParentTaskButton = styled.button`
  cursor: pointer;
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

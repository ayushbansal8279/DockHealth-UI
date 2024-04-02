import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';
import { Popover } from '@mui/material';

export const PriorityLabelContainer = styled.div`
  align-items: center;
  cursor: pointer;
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 1.5rem 1fr;
  padding: 0.5rem;
  color: ${palette.coolGrey1};

  ${({ isHovered }) =>
    isHovered &&
    `
      background-color: ${palette.coolGrey4};

      && > * {
        font-weight: bold;
      }
    `}
`;

export const PriorityFieldContainer = styled.div`
  display: flex;
  align-items: center;
  font-family: Outfit;
  margin: 10px 0 0 9px;
`;

export const PriorityFlagContainer = styled.div`
  left: -0.25rem;
  position: absolute;
  top: calc(50% + 0.5rem);
  transform: translate(-100%, -50%);
`;

export const Title = styled.div`
  margin-right: 35px;
  color: ${palette.coolGrey1};
  font-family: Outfit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  display: flex;
  align-items: center;
`;
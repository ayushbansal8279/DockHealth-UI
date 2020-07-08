/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';

export const ArrowImg = styled.img`
  transform: ${props => props.isOpen && 'rotateX(180deg)'};
  -webkit-transform: ${props => props.isOpen && 'rotateX(180deg)'};
  padding-left: ${spacing.tiny};
  padding-right: ${spacing.smallPlus};
  transition: all 0.5s ease-in-out;
`;

export const ArrowContainer = styled.div`
  display: flex;
  color: ${palette.mediumGrey};
  font-weight: ${fontWeights.bold};
  padding-left: ${spacing.giga};
  cursor: pointer;
  & > span {
    margin-right: ${spacing.tiny};
  }
`;

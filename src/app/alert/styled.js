import styled from 'styled-components';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const GlobalChipWrapper = styled.div`
  position: fixed;
  top: 2rem;
  right: 150px;
  z-index: 5000;
  width: auto;
  height: auto;
  transform: translateX(-50%);
`;

export const CheckCircleIcon = styled.img`
  display: block;
  position: absolute;
  top: 6px;
  left: 7px;
  height: 20px;
  width: 20px;
  color: ${palette.white};
  opacity: ${props => (props.isOpen ? '1' : '0')};
  transition: opacity 0.2s ease-out;
  transition-delay: ${props => (props.isOpen ? '0.3s' : '0.1s')};
`;

export const ChipBackground = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  background-color: ${palette.accentYellow};
  border-radius: 1rem;
  z-index: -1;
  transition: width 0.2s ease-out;
`;

export const ChipLabel = styled.p`
  margin-bottom: 0;
  padding-left: ${spacing.huge};
  padding-right: ${spacing.smallPlus};
  font-size: 1rem;
  font-weight: ${fontWeights.regularPlus};
  color: ${palette.white};
  text-transform: uppercase;
  transition: opacity 0.2s ease-out;
`;

export const ChipContainer = styled.button`
  position: relative;
  width: auto;
  height: ${props => (props.isOpen ? '2rem' : '0')};
  overflow: hidden;
  transition-delay: 1s;
  transition-property: height;

  ${props => props.isOpen && 'transition-property: none;'}

  & ${ChipBackground} {
    width: ${props => (props.isOpen ? '100%' : '0')};
  }

  & ${ChipLabel} {
    opacity: ${props => (props.isOpen ? '1' : '0')};
  }
`;

import styled from 'styled-components';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const GlobalChipWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 180px;
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
  transition: opacity 0.1s ease-out;
  transition-delay: ${props => (props.isOpen ? '0.1.1s' : '0.1s')};
`;

export const ChipBackground = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  background-color: ${props =>
    props.type === 'error' ? palette.oPlusRed : palette.accentYellow};
  border-radius: 1rem;
  z-index: -1;
  transition: width 0.2s linear;
`;

export const ChipText = styled.p`
  margin-bottom: 0;
  transition: opacity 0.2s ease-out;
  font-size: 1rem;
  font-weight: ${fontWeights.regularPlus};
  color: ${palette.white};
  text-transform: uppercase;
`;

export const UndoButtonContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: ${spacing.smallPlus};
  padding-right: ${spacing.huge};
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
  background-color: ${palette.orange};
`;

export const UndoButton = styled.button`
  overflow: hidden;
  transition: width 0.1s linear;
  width: ${({ isVisible }) => (isVisible ? '88px' : '0')};

  & ${ChipText} {
    transition: opacity 0.1s linear;
    transition-delay: ${({ isVisible }) => (isVisible ? '0.1s' : '0s')};
  }
`;

export const MainChipButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: ${spacing.smallPlus};
  padding-left: ${spacing.huge};
`;

export const CounterContainer = styled.div`
  position: absolute;
  right: ${spacing.smallPlus};
  top: 50%;
  transform: translateY(-50%);
`;

export const ChipContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: auto;
  height: ${props => (props.isOpen ? '2rem' : '0')};
  overflow: hidden;
  transition-delay: 1s;
  transition-property: height;
  text-transform: uppercase;

  ${props => props.isOpen && 'transition-property: none;'}

  & ${ChipBackground} {
    width: ${props => (props.isOpen ? '100%' : '0')};
  }

  & ${ChipText} {
    opacity: ${props => (props.isOpen ? '1' : '0')};
  }
`;

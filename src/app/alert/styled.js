import styled from 'styled-components';
import palette from 'styles/palette';
import { fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

const FULL_ANIMATION_TIME = 0.2;

export const IconContainer = styled.div`
  position: absolute;
  top: 6px;
  left: 7px;
  height: 20px;
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  font-size: 20px;
  color: ${palette.white};
  }
`;

export const ChipBackground = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  background-color: ${palette.accentYellow};
  z-index: -1;
`;

export const ChipText = styled.p`
  margin-bottom: 0;
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
  position: fixed;
  top: 20px;
  right: 180px;
  z-index: 5000;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: auto;
  border-radius: 1rem;
  overflow: hidden;
  height: ${({ isOpen }) => (isOpen ? '32px' : '0')};
  transition-property: height;
  transition-delay: ${({ isOpen }) => (isOpen ? 0 : FULL_ANIMATION_TIME)}s;
  text-transform: uppercase;

  & ${ChipBackground} {
    width: ${({ isOpen }) => (isOpen ? '100%' : '0')};
    background-color: ${({ type }) =>
      type === 'error' ? palette.oPlusRed : palette.accentYellow};
    transition: width ${FULL_ANIMATION_TIME}s linear,
      background-color 0s linear
        ${({ isOpen }) => (isOpen ? 0 : FULL_ANIMATION_TIME)}s;
  }

  & ${MainChipButton} {
    & ${IconContainer} {
      opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
      transition: opacity
        ${({ isOpen }) => (isOpen ? FULL_ANIMATION_TIME / 2 : 0)}s linear;
      transition-delay: ${({ isOpen }) => (isOpen ? FULL_ANIMATION_TIME : 0)}s;
    }

    & ${ChipText} {
      opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
      transition: opacity ${FULL_ANIMATION_TIME / 4}s linear;
      transition-delay: ${({ isOpen }) => (isOpen ? FULL_ANIMATION_TIME : 0)}s;
    }
  }

  & ${UndoButton} {
    width: ${({ withUndo }) => (withUndo ? '88px' : 0)};
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    transition: opacity ${FULL_ANIMATION_TIME / 2}s linear
        ${({ isOpen }) => (isOpen ? FULL_ANIMATION_TIME / 2 : 0)}s,
      width 0s linear ${({ isOpen }) => (isOpen ? 0 : FULL_ANIMATION_TIME)}s;
  }
`;

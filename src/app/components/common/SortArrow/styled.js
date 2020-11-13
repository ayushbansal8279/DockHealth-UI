import styled from 'styled-components';
import palette from 'styles/palette';

export const SortArrowContainer = styled.button`
  position: relative;
  height: 19px;
  width: 19px;
  border-radius: 9.5px;
  cursor: pointer;
  background-color: transparent;
  transition: all 0.3s ease-in-out;

  ${({ withBackground, hideIcon }) =>
    !withBackground && `opacity: ${hideIcon ? 0 : 1};`}

  ${({ withBackground }) =>
    withBackground &&
    `
    background-color: ${palette.orange};

    &:hover {
      background-color: ${palette.darkOrange}
    }
  `}
`;

export const ArrowIcon = styled.img`
  position: absolute;
  top: ${({ isUp }) => (isUp ? `48%` : `54%`)};
  left: 50%;

  display: block;
  height: 6px;
  width: 14px;
  transition: all 0.3s ease-in-out;

  transform: translate(-50%, -50%) ${({ isUp }) => isUp && `rotate(180deg)`};
`;

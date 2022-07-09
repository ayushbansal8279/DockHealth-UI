import styled from 'styled-components';
import palette from 'styles/palette';

export const SortArrowContainer = styled.div`
  position: relative;
  height: 13px;
  width: 9px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  transform-origin: 50% 45%;
  color: ${({ ordered }) => (ordered ? palette.white : palette.coolGrey1)};
  ${({ isUp }) => isUp && `transform: rotate(180deg)`};
  ${({ hideIcon, ordered }) => !ordered && `opacity: ${hideIcon ? 0 : 1};`}
`;

export const CircleContainer = styled.div`
  position: relative;
  height: 22px;
  width: 22px;
  cursor: pointer;
  background-color: ${({ ordered }) =>
    ordered ? palette.brightBlue : 'transparent'};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  position: relative;
`;

export default SortArrowContainer;

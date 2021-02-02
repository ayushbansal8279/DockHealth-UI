import styled from 'styled-components';
import palette from 'styles/palette';

export const SortArrowContainer = styled.button`
  position: relative;
  height: 13px;
  width: 9px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  transform-origin: 50% 45%;
  color: ${({ ordered }) => (ordered ? palette.mediumGrey : palette.coolGrey1)};
  ${({ isUp }) => isUp && `transform: rotate(180deg)`};

  ${({ hideIcon, ordered }) => !ordered && `opacity: ${hideIcon ? 0 : 1};`}
`;

export default SortArrowContainer;

import styled, { css } from 'styled-components';
import palette from 'styles/palette';

export const SortArrowContainer = styled.button`
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  ${props => {
    if (props.version === 'secondary') {
      return css`
        background-color: ${props.ordered ? palette.orange : 'transparent'};
        border-radius: 50%;
        padding: 1px;

        * > path {
          stroke: ${({ ordered }) => (ordered ? 'white' : palette.coolGrey1)};
        }
      `;
    }

    return css`
      height: 13px;
      width: 9px;
      transform-origin: 50% 45%;
      color: ${({ ordered }) =>
        ordered ? palette.mediumGrey : palette.coolGrey1};
    `;
  }};

  ${({ isUp }) => isUp && `transform: rotate(180deg)`};

  ${({ hideIcon, ordered }) => !ordered && `opacity: ${hideIcon ? 0 : 1};`}
`;

export default SortArrowContainer;

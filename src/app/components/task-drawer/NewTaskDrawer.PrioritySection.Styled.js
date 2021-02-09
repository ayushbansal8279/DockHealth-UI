import styled from 'styled-components';
import palette from 'styles/palette';

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
  position: relative;
`;

export const PriorityFlagContainer = styled.div`
  left: -0.25rem;
  position: absolute;
  top: calc(50% + 0.5rem);
  transform: translate(-100%, -50%);
`;

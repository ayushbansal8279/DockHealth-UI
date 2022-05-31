import styled from 'styled-components';
import palette from 'styles/palette';

export const Icon = styled.svg`
  fill: none;
  stroke: ${palette.brightBlue};
`;

export const CheckboxInput = styled.div`
  width ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ isCircle }) => (isCircle ? '50%' : '2px')};
  border: ${props =>
    props.isChecked
      ? `1px solid ${palette.brightBlue}`
      : `1px solid ${palette.coolGrey2}`};
  transition: all 150ms;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  ${({ disabled }) =>
    !disabled &&
    `
      &:hover {
        border: 1px solid ${palette.mediumGrey};
      }
  `}

  ${Icon} {
    visibility: ${props => (props.isChecked ? 'visible' : 'hidden')};
  }
  @media print {
    opacity: 0;
  }
`;

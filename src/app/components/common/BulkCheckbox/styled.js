import styled from 'styled-components';
import palette from 'styles/palette';

export const Icon = styled.svg`
  fill: none;
  stroke: ${palette.brightBlue};
`;

export const BulkCheckboxInput = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  border: ${props =>
    props.isChecked
      ? `1px solid ${palette.brightBlue}`
      : `1px solid ${palette.coolGrey3}`};
  transition: all 150ms;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    border: 1px solid ${palette.mediumGrey};
  }

  ${Icon} {
    visibility: ${props => (props.isChecked ? 'visible' : 'hidden')};
  }
`;

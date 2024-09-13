import styled from 'styled-components';
import palette from 'styles/palette';

export const HyperLinkInputInput = styled.input`
  outline: 'none';
  background-color: transparent !important;
  border: ${({ readOnly }) =>
    readOnly ? 'none' : `1px solid #D4D9DF !important`};
  border-radius: '4px';
  color: ${palette.mediumGrey};
  width: 200px;
  height: 30px;
  text-overflow: 'ellipsis';

  &:focus {
    outline: none !important;
    border: none;
  }
`;

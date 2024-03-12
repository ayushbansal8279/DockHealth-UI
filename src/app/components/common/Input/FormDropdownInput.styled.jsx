import styled from 'styled-components';
import SecondaryDropdownInput from '../DropdownInput/SecondaryDropdownInput';

export const StyledDropdownInput = styled(SecondaryDropdownInput)`
  height: ${({ height }) => (height ? `${height}px` : '100%')};
  & .MuiInputBase-input {
    height: ${({ height }) => (height ? `${height}px` : '100%')};
    font-weight: 400;
    transform: translateY(8px);
  }
  & .MuiFormLabel-root {
    ${({ error }) => (error ? 'color: #D32F2F;' : '')}
  }
  & + span {
    display: block;
    color: #d32f2f;
    font-size: 0.75rem;
    margin-top: 10px;
    margin-left: 5px;
  }
`;

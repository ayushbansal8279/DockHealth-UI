import styled from 'styled-components';

// eslint-disable-next-line import/prefer-default-export
export const AttachmentFileInput = styled.input.attrs({
  type: 'file',
})`
  position: absolute;
  top: 0;
  left: 0;
  height: 1px;
  width: 1px;
  visibility: hidden;
`;

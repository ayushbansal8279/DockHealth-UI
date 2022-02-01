import styled from 'styled-components';
import palette from 'styles/palette';

const AttachmentsDropzoneContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  color: ${palette.coolGrey1};
  background-color: ${({ isDragActive }) =>
    isDragActive ? palette.coolGrey3 : palette.white};
  border: ${({ isDragActive }) =>
    isDragActive ? `solid 1px ${palette.coolGrey2}` : `none`};
`;

export default AttachmentsDropzoneContainer;

import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const PatientWidgetsWrapper = styled.div`
  width: 100%;
  min-height: 300px;
  padding: ${spacing.regular} ${spacing.huge};
  background-color: ${(props) =>
    props.isDragActive ? palette.coolGrey3 : palette.white};
  border: ${(props) =>
    props.isDragActive ? `solid 1px ${palette.coolGrey2}` : `none`};
`;

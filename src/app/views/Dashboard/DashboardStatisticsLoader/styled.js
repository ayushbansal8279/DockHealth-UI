import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const LoaderContainer = styled.div`
  width: 100%;
  padding-top: 40px;
`;

export const LoaderTile = styled.div`
  height: 70px;
  width: 100%;
  margin-left: ${spacing.regular};
  border-radius: 10px;
  background-color: ${palette.coolGrey3};
`;

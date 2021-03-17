/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const AlertLoader = styled.div`
  position: relative;
  width: 100%;
  height: 160px;
  margin-bottom: ${spacing.regular};
  border-radius: ${spacing.small};
  background-color: ${palette.white};
  overflow: hidden;
  box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.15);

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 32px;
    background-color: ${palette.coolGrey4};
  }
`;

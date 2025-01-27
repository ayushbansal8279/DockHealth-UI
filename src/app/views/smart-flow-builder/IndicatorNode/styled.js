/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const StartIndicatorNodeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px;
  width: 200px;
  border-radius: 30px;
  background: ${palette.brightBlue};
  color: ${palette.white};
  font-size: ${fontSizes.regularPlus};
`;
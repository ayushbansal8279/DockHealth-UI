import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const Container = styled.div`
  display: inline-block;
  height: 420px;
  width: 100%;
  padding: 24px 48px;
  background: ${palette.white};
  border-radius: 8px;
  border-top: 8px solid ${palette.black};
  box-shadow: 0px 6px 9px rgba(0, 0, 0, 0.17);
  overflow: hidden;
`;

export const Title = styled.p`
  margin-bottom: 24px;
  font-size: ${fontSizes.regularPlus};
  font-weight: ${fontWeights.bold};
  color: ${palette.black};
`;

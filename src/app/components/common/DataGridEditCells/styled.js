import palette from '@/app/styles/palette';
import styled from 'styled-components';

export const TooltipPre = styled.pre`
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  white-space: pre-wrap;
  word-break: keep-all;
`;

export const PlaceholderText = styled.span`
  color: ${palette.lightGrey};
`;
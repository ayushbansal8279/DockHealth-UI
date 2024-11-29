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

export const ErrorText = styled.span`
  font-size: 10px;
  color: ${palette.error};
  margin-top: 4px;
`;
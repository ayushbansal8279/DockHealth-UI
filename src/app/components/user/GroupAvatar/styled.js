import styled from 'styled-components';
import { fontSizes } from 'styles/font';

export const TooltipContent = styled.div`
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  max-width: 156px;
`;

export const UserName = styled.div`
  font-size: ${fontSizes.small};
`;

export const MoreText = styled.div`
  font-size: ${fontSizes.small};
  margin-top: 5px;
  text-align: right;
  width: 100%;
`;

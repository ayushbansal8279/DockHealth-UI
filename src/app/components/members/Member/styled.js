import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';

export const TooltipName = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.bold};
  font-family: 'Montserrat', sans-serif;
`;

export const TooltipStatus = styled(TooltipName)`
  font-weight: ${fontWeights.light};
`;

export const TooltipContent = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  max-width: 156px;
`;

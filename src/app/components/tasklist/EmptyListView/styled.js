import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import spacing from 'styles/spacing';

export const EmptyListContainer = styled.div`
  margin: ${spacing.huge} 0;
  text-align: center;
  font-size: ${fontSizes.huge};
  font-weight: ${fontWeights.bold};
`;

export default { EmptyListContainer };

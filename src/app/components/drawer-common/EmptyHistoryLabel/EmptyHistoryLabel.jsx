import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

const EmptyHistoryLabel = styled.p`
  color: ${palette.greyBlue};
  font-size: ${fontSizes.smallPlus};
  margin-bottom: 0;
`;

export default EmptyHistoryLabel;

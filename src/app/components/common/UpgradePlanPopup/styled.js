import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import Button from 'components/common/Button/Button';

export const UpgradePlanPopupContainer = styled.div`
  width: 310px;
  height: 338px;
`;

export const Header = styled.div`
  padding: ${spacing.regular};
  padding-bottom: 0;
`;

export const UpgradePlanContent = styled.div`
  padding: ${spacing.regular};
`;

import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';

export const LabeledCollapseWrapper = styled.div`
  padding: ${spacing.small};
  border: ${props =>
    props.noBorder ? 'none' : `1px solid ${palette.coolGrey3}`};
  background: ${palette.white};

  &:not(:last-of-type) {
    margin-bottom: ${spacing.smallPlus};
  }
`;

export const LabeledCollapseHeaderButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const LabeledCollapseItemName = styled.p`
  display: block;
  flex: 1;
  margin: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  text-align: left;
`;

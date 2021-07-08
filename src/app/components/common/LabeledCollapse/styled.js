/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontSizes } from 'styles/font';

export const LabeledCollapseWrapper = styled.div`
  padding: ${spacing.small};
  border: 1px solid ${palette.coolGrey3};
  background: ${palette.coolGrey4};

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
  text-align: left;
`;

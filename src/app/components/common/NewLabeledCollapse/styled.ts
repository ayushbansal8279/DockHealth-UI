import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';
import { Button } from '@mui/material';

export const LabeledCollapseWrapper = styled.div`
  padding: ${spacing.small};
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
  font-weight: ${fontWeights.regular};
  text-align: left;
`;

export const AddButton = styled(Button)`
  background-color: ${palette.midnightBlue};
  border: 1px solid ${palette.coolGrey3};
  color: ${palette.white};
  font-weight: ${fontWeights.regular};
  text-align: left;
  padding: 3px 12px 3px 5px;
  border-radius: 5px;

  &:hover {
    background-color: ${palette.newBrightBlue};
    color: ${palette.white};
  }
`;

export const NameWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
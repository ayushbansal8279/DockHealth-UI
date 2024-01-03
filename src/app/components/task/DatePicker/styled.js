import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 320px;
  border: none;
  font-family: ${typography.text};
`;

export const Divider = styled.hr`
  width: 100%;
  margin: 0;
  border-color: ${palette.coolGrey3};
`;

export const QuickAddSectionWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${spacing.small};
`;

export const QuickSelectButton = styled.button`
  padding: ${spacing.tiny} ${spacing.regular};
  background: ${palette.coolGrey4};
  border-radius: 13px;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
  color: ${palette.coolGrey1};

  ${({ isSelected }) =>
    isSelected &&
    `
    background: ${palette.brightBlue};
    color: ${palette.white};
  `}
`;

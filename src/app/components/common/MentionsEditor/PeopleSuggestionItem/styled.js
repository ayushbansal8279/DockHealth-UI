import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const SuggestionItemContainer = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 30px 1fr;
  align-items: center;
  width: 100%;
  height: 40px;
  width: 100%;
  padding: ${spacing.small};
  ${({ isFocused }) => isFocused && `background-color: ${palette.coolGrey6};`}
  cursor: pointer;

  > * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const SuggestionText = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
  font-family: inherit;
`;

export const MemberNameSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const StatusNameSection = styled.div`
  font-family: 'Roboto Condensed';
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
`;

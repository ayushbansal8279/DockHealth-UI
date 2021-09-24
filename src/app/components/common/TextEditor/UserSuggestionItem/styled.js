import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const SuggestionText = styled.div`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
  font-family: inherit;
`;

export const SuggestionItemContainer = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 30px 1fr auto;
  align-items: center;
  width: 100%;
  height: 40px;
  width: 100%;
  padding: ${spacing.tiny};
  ${({ isFocused }) => isFocused && `background-color: ${palette.coolGrey6};`}
  cursor: pointer;

  & > ${SuggestionText} {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const StatusNameSection = styled.div`
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.extraLight};
  color: ${palette.coolGrey1};
`;

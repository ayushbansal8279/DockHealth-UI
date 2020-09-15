import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const SuggestionItemContainer = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 1fr 4rem 6rem;
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

export const SuggestionText = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
  font-family: inherit;
`;

export default SuggestionItemContainer;

import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const DefaultSuggestionItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: ${spacing.small};
  color: ${palette.brightBlue};
`;

const Text = styled.p`
  display: block;
  margin-bottom: 0;
  color: inherit;
  font-family: inherit;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.bold};
`;

export const TagType = styled(Text)``;

export const HintText = styled(Text)`
  flex: 1;
  margin-left: ${spacing.small};
  font-weight: ${fontWeights.light};
`;

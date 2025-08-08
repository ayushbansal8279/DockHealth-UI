import { Box } from '@mui/material';
import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

export const DescriptionContainer = styled.div`
  flex: 1;
`;

export const HistoryContainer = styled(Box)`
  display: flex;
  align-items: center;
`;

export const DescriptionTooltipText = styled.div`
  max-height: 400px;
  overflow: auto;
`;

export const DescriptionContent = styled.div`
  display: block;
  max-width: 270px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &,
  * {
    display: inline;
    white-space: nowrap;
    padding: 0;
    margin: 0;
    vertical-align: baseline;
    list-style: none;
  }

  ul li::before {
    content: '• ';
    margin-right: 2px;
  }

  ol {
    counter-reset: item;
  }

  ol li::before {
    counter-increment: item;
    content: counter(item) '. ';
    margin-right: 2px;
  }

  li,
  li * {
    display: inline;
  }
`;

export const Text = styled.p`
  margin: 0;
  color: ${palette.coolGrey2};
  font-family: inherit;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
`;

export const Description = styled(Text)`
  color: ${palette.mediumGrey};
`;

export const DateText = styled(Text)`
  line-height: 1;
`;

export const TypeText = styled(Text)`
  display: block;
`;

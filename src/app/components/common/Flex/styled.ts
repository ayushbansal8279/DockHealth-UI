import styled from 'styled-components';

interface FlexProps {
  al?: string;
  j?: string;
  gap?: number;
  pt?: number;
  pb?: number;
  pr?: number;
  pl?: number;
}

export const Flex = styled.div<FlexProps>`
  display: flex;
  align-items: ${({ al }) => al || 'center'};
  justify-content: ${({ j }) => j || 'center'};
  gap: ${({ gap }) => `${gap}px` || '0px'};
  padding-top: ${({ pt }) => `${pt}px` || '0px'};
  padding-bottom: ${({ pb }) => `${pb}px` || '0px'};
  padding-right: ${({ pr }) => `${pr}px` || '0px'};
  padding-left: ${({ pl }) => `${pl}px` || '0px'};
`;

import styled from 'styled-components';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontWeights } from 'styles/font';

export const PopoverContainer = styled.div`
  background-color: ${palette.white};
  width: 350px;
  box-shadow: 0px 4px 11px grey;
  max-height: 800px;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const SectionContainer = styled.div`
  padding: ${spacing.regularPlus};
`;

export const ListElement = styled.div`
  padding-bottom: ${spacing.regularPlus};
  display: flex;
  cursor: pointer;
  align-items: center;
  &:last-of-type {
    padding-bottom: 0px;
  }
`;

export const TextElement = styled.div`
  padding-left: ${spacing.regular};
`;

export const PlusIcon = styled.span`
  color: ${palette.coolGrey2};
`;

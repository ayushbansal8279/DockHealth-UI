import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const OptionsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  opacity: 0;
  transition: opacity 0.3s linear;
`;

export const TaskInfoWrapper = styled.div`
  padding: 0 12px 12px;
`;

export const TaskDescription = styled.p`
  margin-bottom: 0;
  font-family: 'Roboto Condensed', sans-serif;
  font-weight: ${fontWeights.regular};
  color: ${palette.mediumGrey};
`;

export const ContentWrapper = styled.div`
  padding: 4px;

  &:hover {
    ${OptionsContainer} {
      opacity: 1;
    }
  }
`;

export const SubtasksLabel = styled.div`
  padding: 0 10px;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.bold};
  color: ${palette.coolGrey1};
  background: ${palette.coolGrey4};
  border-radius: 9px;
`;

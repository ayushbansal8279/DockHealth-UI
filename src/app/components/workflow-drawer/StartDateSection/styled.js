import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const StartDateLabel = styled.label`
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.small};
  text-transform: uppercase;
`;

export const StartDateContentWrapper = styled.div`
  width: 100%;
  padding: ${spacing.tiny} 0;
  text-align: left;
  border-bottom: 1px solid ${palette.coolGrey1};
  padding: 25px 10px 6px 10px;
`;

export const StartDateContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  color: ${({ error }) => (error ? palette.error : palette.mediumGrey)};
  font-weight: ${fontWeights.bold};
`;

export const StartDateText = styled.p`
  margin-bottom: 0;
`;

export const Placeholder = styled.p`
  color: ${palette.coolGrey1};
  margin-bottom: 0;
`;

export const StartDateSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 54px;
  font-family: 'Roboto Condensed', sans-serif;

  ${({ disabled }) =>
    disabled &&
    `
    pointer-events: none;
    
    & ${Placeholder}, & ${StartDateLabel} {
      color: ${palette.coolGrey2};
    }

    & ${StartDateContent} {
      border-color: ${palette.coolGrey2};
    }
  `}
`;

export const DueDateText = styled.p`
  margin-bottom: 0;
`;

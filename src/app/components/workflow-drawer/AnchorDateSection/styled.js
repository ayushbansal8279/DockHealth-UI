import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';

export const AnchorDateLabel = styled.label`
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.small};
  text-transform: uppercase;
`;

export const AnchorDateContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: ${spacing.tiny} 0;
`;
export const Title = styled.div`
  margin-left: 1px;
  margin-right: 30px;
  color: ${palette.coolGrey1};
  font-family: Outfit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  display: flex;
  align-items: center;
  width: 125px;
`;

export const AnchorDateContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  color: ${({ error }) => (error ? palette.error : palette.mediumGrey)};
  font-weight: ${fontWeights.bold};
`;

export const DateViewContainer = styled.div`
  margin-left: 5px;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 4px 8px;
  border-radius: 8px;
  color: ${({ isOverdue }) =>
    isOverdue ? `${palette.white}` : `${palette.black}`};
  background: ${({ isOverdue }) =>
    isOverdue ? `${palette.oPlusRed}` : '#F8F8F9'};
`;

export const AnchorDateText = styled.p`
  margin-bottom: 0;
`;

export const Placeholder = styled.p`
  color: ${palette.coolGrey1};
  margin-bottom: 0;
`;

export const AnchorDateSectionWrapper = styled.div`
  display: flex;
  align-items: center;
  font-family: Outfit;

  ${({ disabled }) =>
    disabled &&
    `
    & ${Placeholder}, & ${AnchorDateLabel} {
      color: ${palette.coolGrey2};
    }

    & ${AnchorDateContent} {
      border-color: ${palette.coolGrey2};
    }
  `}
`;

export const DueDateText = styled.p`
  margin-bottom: 0;
`;

import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';

export const DueDateLabel = styled.label`
  color: ${palette.coolGrey1};
  font-size: ${fontSizes.small};
  text-transform: uppercase;
`;

export const DueDateContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: ${spacing.tiny} 0;
`;

export const DueDateContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  color: ${({ error }) => (error ? palette.error : palette.mediumGrey)};
  font-weight: ${fontWeights.bold};
`;

export const DueDateText = styled.p`
  margin-bottom: 0;
`;

export const Placeholder = styled.p`
  color: ${palette.coolGrey1};
  margin-bottom: 0;
`;

export const DueDateSectionWrapper = styled.div`
  display: flex;
  align-items: center;
  font-family: Outfit;
  width: 33%;
  white-space: nowrap;
  text-overflow: ellipsis;
  ${({ disabled }) =>
    disabled &&
    `
    pointer-events: none;
    & ${Placeholder}, & ${DueDateLabel} {
      color: ${palette.coolGrey2};
    }

    & ${DueDateContent} {
      border-color: ${palette.coolGrey2};
    }
  `}
`;

export const Title = styled.div`
  margin-left: 10px;
  margin-right: 41px;
  color: ${palette.coolGrey1};
  font-family: Outfit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  display: flex;
  align-items: center;
  width: 70px;
  white-space: nowrap;
  text-overflow: ellipsis;
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

export const DateViewText = styled.div`
  font-family: Outfit;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
  text-wrap: nowrap;
`;

export const SubTitle = styled.div`
  margin-left: 10px;
  color: ${palette.coolGrey1};
  font-family: Outfit;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.light};
`;

export const NoDateContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 5px;
`;

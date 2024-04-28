import { fontSizes, fontWeights } from '@/app/styles/font';
import styled from 'styled-components';
import palette from 'styles/palette';

export const PriorityLabelContainer = styled.div`
  align-items: center;
  cursor: pointer;
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 1.5rem 1fr;
  padding: 0.5rem;
  color: ${palette.coolGrey1};

  ${({ isHovered }) =>
    isHovered &&
    `
      background-color: ${palette.coolGrey4};

      && > * {
        font-weight: bold;
      }
    `}
`;

export const PriorityFieldContainer = styled.div`
  display: flex;
  align-items: center;
  font-family: Outfit;
  margin: 10px 13px;
`;

export const PriorityFlagContainer = styled.div`
  display: flex;
  align-items: center;
  height: 35px;
  border-radius: 8px;
  background: ${({IsPriority}) => IsPriority && '#F8F8F9'};
`;

export const Title = styled.div`
  margin-right: 40px;
  color: ${palette.coolGrey1};
  font-family: Outfit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  display: flex;
  align-items: center;
`;

import styled from 'styled-components';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from '@/app/styles/font';

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
`;

export const PriorityFlagContainer = styled.div`
  display: flex;
  align-items: center;
  height: 35px;
  border-radius: 8px;
  background: ${({IsPriority}) => IsPriority && '#F8F8F9'};
`;

export const Title = styled.div`
  margin-left: 10px;
  margin-right: 43px;
  color: ${palette.coolGrey1};
  font-family: Outfit;
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  display: flex;
  align-items: center;
`;

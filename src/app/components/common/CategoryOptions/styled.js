import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from '@/app/styles/palette';

export const LabeledCollapseHeaderButton = styled.button`
  display: flex;
  align-items: flex-end;
  margin-top: ${({coreTask}) => coreTask ? '' : '-35px'};
`;

export const LabeledCollapseItemName = styled.p`
  color: ${palette.shadowBlue};
  text-align: right;
  font-family: Outfit;
  font-size: ${fontSizes.smallPlus};
  font-style: normal;
  font-weight: ${fontWeights.light};
  line-height: 30px;
  height: 10px;

  &:hover{
    color: ${palette.lighterCyanBlue};
  }
`;

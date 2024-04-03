import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from '@/app/styles/palette';

export const LabeledCollapseHeaderButton = styled.button`
  display: flex;
  align-items: flex-end;
  width: 100%;
  margin-top: ${({coreTask}) => coreTask ? '' : '-35px'};
  margin-left: ${({coreTask}) => coreTask ? '' : '500px'};
  margin-bottom: -15px;
`;

export const LabeledCollapseItemName = styled.p`
  color: ${palette.shadowBlue};
  text-align: right;
  font-family: Outfit;
  font-size: ${fontSizes.smallPlus};
  font-style: normal;
  font-weight: ${fontWeights.light};
  line-height: 30px;
`;

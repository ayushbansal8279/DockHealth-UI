import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from '@/app/styles/palette';
import { fontSizes } from '@/app/styles/font';

export const BulkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${spacing.smallPlus};
`;

export const TaskTemplateContainer = styled.div`
  width: 100%;
  margin-bottom: ${spacing.smallPlus};
  text-align: left;
  animation-duration: 3.5s;
  background-color: ${palette.white};
  animation-timing-function: ease-in-out;
`;

export const TaskTemplateHeader = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  grid-template-rows: auto;
  align-items: center;
  width: 100%;
  padding: 2px 0px 2px ${spacing.smallPlus};
  border: 1px solid ${palette.coolGrey3};
  font-family: inherit;
  font-size: ${fontSizes.smallPlus};
`;

export const HeaderChildrenContainer = styled.div`
  grid-column: 3;
`;

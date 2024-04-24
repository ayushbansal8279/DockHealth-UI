import styled from 'styled-components';
import spacing from 'styles/spacing';
import { fontSizes } from 'styles/font';
import palette from '@/app/styles/palette';

export const TaskBasicLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: ${fontSizes.small};
`;

export const TaskLabelText = styled.p`
  margin-bottom: 0;
  white-space: nowrap;
  font-family: Outfit;
  font-size: 14px;
  font-weight: 400;
  line-height: 18.9px;
  text-align: left;
  overflow-x: hidden;
  text-overflow: ellipsis;
`;

export const TaskLabelTextContainer = styled.div`
  align-items: center;
  border-radius: 2px;
  background: ${palette.whiteSmoke};
  padding: 3px ${spacing.small};
  color: ${palette.gunmetal};
  max-width: 135px;
  // max-width: ${({ labelWidth, columnWidth }) =>
    labelWidth > columnWidth ? `${columnWidth - 20}px` : '135px'};
  // margin-right: 4px;
`;

export const AdditionalTaskLabelCounter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: ${fontSizes.small};
`;

export const AdditionalTaskLabelText = styled.p`
  margin-bottom: 0;
  white-space: nowrap;
  font-family: Outfit;
  font-size: 14px;
  font-weight: 400;
  line-height: 18.9px;
  text-align: left;
  max-width: 135px;
  overflow-x: hidden;
  text-overflow: ellipsis;
`;

export const AdditionalTaskLabelContainer = styled.div`
  align-items: center;
  border-radius: 2px;
  background: ${palette.whiteSmoke};
  padding: 3px ${spacing.small};
  color: ${palette.gunmetal};
  max-width: 135px;
  // margin-right: 4px;
`;

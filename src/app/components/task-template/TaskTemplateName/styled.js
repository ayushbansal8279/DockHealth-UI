import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontSizes, fontWeights } from 'styles/font';

export const TaskTemplateNameInput = styled.input`
  width: 100%;
  margin-bottom: 0;
  padding: ${spacing.small};
  color: ${({ error }) => (error ? palette.error : palette.mediumGrey)};
  font-weight: ${fontWeights.regular};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background-color: transparent;
  border: 1px solid
    ${({ error }) => (error ? palette.error : palette.coolGrey2)};
  border-radius: 5px;
  background: ${palette.coolGrey4};
  margin-left: ${spacing.small};

  &[readonly] {
    background-color: transparent;
    cursor: initial;
    outline: none;
    border: none;
  }

  &:focus {
    outline: none;
  }

  @media print {
    height: auto;
    text-overflow: auto;
    overflow: auto;
    white-space: wrap;
    min-width: 200px;
  }
`;

export const NameTooltip = styled.div`
  display: block;
  width: 100%;
  padding: ${spacing.small};
  color: ${palette.white};
  background: ${palette.mediumGrey};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.regular};
  cursor: initial;
`;

export const NameContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-left: 7px;
  font-weight: 500;
`;

export const TaskTemplateDescriptionIndicators = styled.div`
  display: flex;
  align-items: baseline;
`;

export const TaskTemplateContext = styled.div`
  align-items: flex-end;
  display: flex;
  overflow: hidden;
  font-size: ${fontSizes.small};
  padding-left: 15px;
  padding-bottom: 2px;

  > span {
    color: ${palette.brightBlue};
    font-weight: ${fontWeights.regular};
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100px;
    // padding-top: 10px;
  }
`;

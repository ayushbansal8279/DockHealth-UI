/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';

export const Header = styled.h2`
  margin-bottom: 0;
  font-size: ${fontSizes.huge};
  font-weight: ${fontWeights.bold};
  font-family: 'Montserrat', sans-serif;
`;

export const ViewContainer = styled.div`
  max-width: 798px;
  width: 100%;
  margin: 0 auto;
  padding: 50px 20px;
  color: ${palette.mediumGrey};
  font-family: 'Roboto Condensed', sans-serif;
`;

export const EmptyListPlaceholder = styled.p`
  margin-bottom: 0;
  color: ${palette.coolGrey1};
`;

export const CustomFieldItem = styled.div`
  position: relative;
  width: 100%;
  height: 35px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto auto;
  align-items: center;
  margin-bottom: 2px;
  border: 1px solid ${palette.coolGrey3};
  background-color: ${palette.white};
  font-size: ${fontSizes.smallPlus};
`;

export const CustomFieldCell = styled.div`
  padding: 0px 4px;
  overflow: hidden;

  &:first-of-type {
    padding-left: 8px;
  }

  &:last-of-type {
    padding-right: 8px;
  }
`;

export const CustomFieldText = styled.p`
  margin-bottom: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CustomFieldHeaderText = styled(CustomFieldText)`
  text-transform: uppercase;
  font-weight: ${fontWeights.bold};
`;
export const DragHandle = styled.div`
  position: absolute;
  left: -12px;
  color: ${palette.coolGrey2};
  transition: opacity 0.3s ease-out;
  cursor: grab;
  outline: none;
`;

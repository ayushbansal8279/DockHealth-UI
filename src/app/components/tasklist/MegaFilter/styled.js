/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import InputMask from 'react-input-mask';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const MegaFilterNoResultsLabel = styled.p`
  color: ${palette.oPlusRed};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.bold};
  font-family: 'Montserrat', sans-serif;
  margin-bottom: 0;
`;

export const FilterLabel = styled.label`
  color: ${palette.lightGrey};
  font-weight: ${fontWeights.bold};
  font-size: ${fontSizes.smallPlus};
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
`;

export const StyledUnassignedIcon = styled.img`
  width: 25px; // per design
`;

export const OptionLabel = styled.span`
  width: 180px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const DueDateRangePickerRowContainer = styled.div`
  margin-top: ${spacing.regular};
  font-size: ${fontSizes.small};
`;

export const DueDateRangePickerInputsWrapper = styled.div`
  position: relative;
  margin-top: ${spacing.small};
  width: 168px; // per design
  display: flex;
  flex-direction: row;
`;

export const DueDateInput = styled(({ hasError, ...props }) => (
  <InputMask {...props} />
))`
  display: block;
  width: 100%;
  padding: 0 6px;
  border-width: 1px;
  border-style: solid;
  border-color: ${props => (props.hasError ? palette.red : palette.coolGrey2)};
  border-radius: 2px;
  overflow: auto;
  color: ${props => (props.hasError ? palette.red : palette.coolGrey2)};
  font-size: ${fontSizes.small};
`;

export const DueDateInputWrapper = styled.div`
  flex: 1;
  padding-bottom: ${spacing.regularPlus};
`;

export const DueDateErrorMessage = styled.p`
  position: absolute;
  bottom: 0;
  ${({ alignLeft }) => (alignLeft ? 'left: 0;' : 'right: 0;')}
  text-align: ${({ alignLeft }) => (alignLeft ? 'left' : 'right')};
  width: 168px; // per design
  margin-bottom: 0;
  color: red;
`;

export const PopperContent = styled.div`
  min-width: 293px;
  border: none;
  box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.17);
  background: ${palette.white};
`;

/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import styled from 'styled-components';
import InputMask from 'react-input-mask';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { makeStyles } from '@material-ui/core/styles';

export const PatientDetailsInputContainer = styled.div`
  max-width: 320px;
  width: 100%;
  margin-right: ${spacing.huge};
  position: relative;
  padding-bottom: ${spacing.large};
`;

const getInputBorderBottom = ({ isActive, hasError }) => {
  if (hasError) {
    return `1px solid ${palette.oPlusRed}`;
  }

  if (isActive) {
    return `1px solid ${palette.lightGrey}`;
  }

  return '1px solid transparent';
};

export const InputBox = styled.div`
  border-bottom: ${props => getInputBorderBottom(props)};
  transition: border-bottom 0.3s ease-in;
`;

export const StyledPatientDetailsInput = styled.input`
  border: 0;
  width: 100%;
  color: ${palette.darkGrey};
  font-weight: ${fontWeights.bold};
  padding: ${spacing.small} 0;
  outline: none;

  &:disabled {
    background: transparent;
    cursor: default;
  }
`;

export const StyledPatientDetailsInputMask = styled(
  ({ hasError, isActive, ...props }) => <InputMask {...props} />,
)`
  border: 0;
  width: 100%;
  color: ${palette.darkGrey};
  font-weight: ${fontWeights.bold};
  padding: ${spacing.small} 0;
  outline: none;

  &:disabled {
    background: transparent;
    cursor: default;
  }
`;

export const PatientDetailsInputLabel = styled.label`
  text-transform: uppercase;
  color: ${props => (props.hasError ? palette.oPlusRed : palette.lightGrey)};
  font-size: ${fontSizes.small};
  transition: color 0.3s ease-in;
`;

export const PatientDetailsForm = styled.form`
  padding: ${spacing.largePlus} 0;
  border-bottom: 3px solid ${palette.blueGrey};
`;

export const PatientDetailsFormRow = styled.div`
  display: flex;
  padding: 0 ${spacing.giga} ${spacing.small};
`;

export const PatientDetailsButton = styled.button`
  color: ${props => (props.isEdit ? palette.darkBlue : palette.coolGrey2)};
  width: fit-content;
  font-weight: ${fontWeights.regularPlus};
  margin-left: ${spacing.giga};
  font-size: ${fontSizes.regularPlus};
  cursor: pointer;
  text-decoration: underline;
  border: none;
`;

export const PatientDetailsCancelButton = styled(PatientDetailsButton)`
  color: ${palette.coolGrey2};
  height: fit-content;
  padding: 0 54px; // per design
`;

export const PatietnDetailsFormFooter = styled.div`
  display: flex;
  align-items: center;
`;

export const PatientDetailsInputError = styled.div`
  color: ${props => (props.hasError ? palette.oPlusRed : 'transparent')};
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: ${fontSizes.small};
  transition: color 0.3s ease-in;
`;

export const usePhoneNumberStyles = makeStyles({
  root: {
    '& .MuiButtonBase-root': {
      height: 30,
    },
    '& .MuiInputBase-input': {
      border: 'none',
      background: 'transparent',
      boxShadow: 'none',
      fontFamily: 'roboto condensed',
      fontWeight: '700',
    },
    '& .MuiInputBase-input:disabled': {
      color: 'black',
      backgroundColor: 'white',
    },
    '& .Mui-focused input': {
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
    },
    '& .MuiInput-underline:after': {
      display: 'none',
    },
    '& .MuiInput-underline:before': {
      display: 'none',
    },
  },
});

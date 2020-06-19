import styled from 'styled-components';
import InputMask from 'react-input-mask';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const PatientDetailsInputContainer = styled.div`
  max-width: 320px;
  width: 100%;
  margin-right: ${spacing.huge}
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

export const StyledPatientDetailsInput = styled.input`
  border: 0;
  width: 100%;
  border-bottom: ${props => getInputBorderBottom(props)};
  color: ${palette.darkGrey};
  font-weight: ${fontWeights.bold};
  padding: ${spacing.small} 0;
  outline: none;
  transition: border-bottom 0.3s ease-in;

  &:disabled {
    background: transparent;
    cursor: default;
  }
`;

export const StyledPatientDetailsInputMask = styled(InputMask)`
  border: 0;
  width: 100%;
  border-bottom: ${props => getInputBorderBottom(props)};
  color: ${palette.darkGrey};
  font-weight: ${fontWeights.bold};
  padding: ${spacing.small} 0;
  outline: none;
  transition: border-bottom 0.3s ease-in;

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
  border-bottom: 3px solid #f5f8fa;
`;

export const PatientDetailsFormRow = styled.div`
  display: flex;
  padding: 0 ${spacing.giga} ${spacing.regularPlus};
`;

export const PatientDetailsButton = styled.button`
  color: ${palette.darkBlue};
  width: fit-content;
  font-weight: ${fontWeights.regularPlus};
  margin-left: ${spacing.giga};
  font-size: ${fontSizes.regularPlus};
  cursor: pointer;
  text-decoration: underline;
  border: none;
`;

export const PatientDetailsCancelButton = styled(PatientDetailsButton)`
  color: #c1ccda;
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

import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette, { typography } from 'styles/palette';
import { Button } from '@mui/material';
import spacing from 'styles/spacing';

export const StyledForm = styled.form`
  position: relative;
  display: flex;
  flex: 1;
  width: 100%;
`;

export const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const CheckboxDescription = styled.label`
  color: ${palette.black};
  font-family: Outfit;
  font-size: 16px;
  font-style: normal;
  font-weight: ${fontWeights.light};
  line-height: 25px; /* 156.25% */
  margin-right: 30px;
`;

export const ConfirmButton = styled(Button)`
  display: flex;
  height: 40px;
  padding: 22px 24px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background-color: ${palette.oPlusRed};
  color: ${palette.white};
  text-align: center;
  font-family: Outfit;
  font-style: normal;
  font-weight: ${fontWeights.regular};
  line-height: 11.189px;
  text-transform: none;

  &:hover {
    background-color: ${palette.oPlusRed};
    color: ${palette.white};
  }
`;

export const CancelButton = styled(Button)`
  display: flex;
  height: 40px;
  padding: 22px ${spacing.large};
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  border: 1px solid ${palette.oPlusRed};
  color: ${palette.oPlusRed};
  font-family: Outfit;
  text-align: center;
  font-style: normal;
  font-weight: ${fontWeights.regular};
  line-height: 11.189px;
  text-transform: none;
`;

export const PrivacyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin-left: 10px;
`;
export const PrivacyTitle = styled.div`
  color: ${palette.offBlack};
  font-family: Outfit;
  font-size: 18px;
  font-style: normal;
  font-weight: ${fontWeights.regularPlus};
  line-height: 25px;
  text-transform: capitalize;
`;

export default StyledForm;

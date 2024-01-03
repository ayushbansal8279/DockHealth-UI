import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette, { typography } from 'styles/palette';

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
  padding-left: 10px;
`;

export const CheckboxDescription = styled.label`
  display: inline;
  font-family: ${typography.text};
  font-size: ${fontSizes.regular};
  color: ${palette.scrollbarGrey};
`;

export default StyledForm;

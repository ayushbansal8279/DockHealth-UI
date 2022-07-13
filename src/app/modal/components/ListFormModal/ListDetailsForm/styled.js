import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

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
  font-family: 'Roboto Condensed', sans-serif;
  font-size: ${fontSizes.regular};
  color: ${palette.scrollbarGrey};
`;

export default StyledForm;

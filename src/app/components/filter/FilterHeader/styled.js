import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const Title = styled.label`
  color: ${palette.mediumGrey};
  text-transform: uppercase;
  font-size: ${fontSizes.smallPlus};
  font-family: 'Roboto', sans-serif;
`;

export const ClearButton = styled.button`
  display: flex;
  align-items: center;
  margin-left: 8px;
  color: ${palette.brightBlue};
  font-size: ${fontSizes.smallPlus};
  cursor: ${props => (props.disabled ? 'initial' : 'pointer')};
  text-transform: uppercase;
`;

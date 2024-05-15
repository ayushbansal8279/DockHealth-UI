import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette, { typography } from 'styles/palette';
import spacing from 'styles/spacing';

export const Container = styled.div`
  width: 100%;
  justify-content: space-between;
`;

export const Title = styled.label`
  color: ${palette.mediumGrey};
  text-transform: uppercase;
  font-size: ${fontSizes.smallPlus};
  font-family: inherit;
`;

export const HeaderButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0 ${spacing.regular};
  color: ${palette.brightBlue};
  font-size: ${fontSizes.smallPlus};
  cursor: ${(props) => (props.disabled ? 'initial' : 'pointer')};
  text-transform: uppercase;
  height: fit-content;
  :not(:first-of-type) {
    border-left: 1px solid ${palette.coolGrey3};
  }
`;

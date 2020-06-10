import styled from 'styled-components';
import spacing from 'styles/spacing';
import palette from 'styles/palette';
import { fontWeights, fontSizes } from 'styles/font';

export const Cross = styled.span`
  color: ${palette.orange};
  cursor: pointer;
  margin-right: ${spacing.smallPlus};
`;

export const Description = styled.div`
  color: ${palette.lightGrey};
  margin-left: ${spacing.regularPlus};
`;

export const Header = styled.span`
  color: ${palette.brightBlue};
  cursor: pointer;
  font-weight: ${fontWeights.regularPlus};
  text-transform: uppercase;
`;

export const ButtonWrapper = styled.button`
  text-align: left;
`;

export const StyledInput = styled.input`
  background-color: white;
  border: 1px solid ${palette.coolGrey3};
  border-radius: 4px;
  outline: none;
  padding: ${spacing.smallPlus} ${spacing.regularPlus};
  width: 100%;
  margin-top: ${spacing.largePlus};
  margin-left: ${spacing.regular};
  font-sizes: ${fontSizes.smallPlus};
`;

export const InputBox = styled.div`
  margin-left: 120px; // per design
  display: flex;
  align-items: baseline;
`;

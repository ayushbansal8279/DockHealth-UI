import styled from 'styled-components';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const OptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  padding: ${spacing.tiny} ${spacing.regular};
  color: ${({ color, disabled }) =>
    disabled ? palette.coolGrey2 : color || palette.black};

  ${({ disabled }) =>
    !disabled &&
    `
      &:hover {
        background-color: ${palette.brightBlueWithAlpha};
      }
  `}

  & > p {
    margin: 0;
    font-size: ${fontSizes.smallPlus};
    font-weight: ${fontWeights.light};
  }
`;

export const IconBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  margin-bottom: ${spacing.tiny};
`;

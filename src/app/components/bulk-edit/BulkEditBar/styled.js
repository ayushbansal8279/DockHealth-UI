import styled from 'styled-components';
import MaterialCloseIcon from '@material-ui/icons/Close';
import { fontSizes, fontWeights } from 'styles/font';
import palette from 'styles/palette';
import spacing from 'styles/spacing';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  width: fit-content;
  border: 1px solid ${palette.coolGrey2};
  border-bottom: none;
  background-color: ${palette.white};
  font-family: 'Roboto Condensed', sans-serif;
  color: ${palette.mediumGrey};
`;

export const TasksText = styled.p`
  margin-bottom: 0;
  margin-left: ${spacing.regular};
  margin-right: 80px;
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.light};
  white-space: nowrap;
`;

export const CloseButton = styled.button`
  height: 100%;
  width: 60px;
  color: ${palette.black};
  color: ${({ disabled }) => (disabled ? palette.coolGrey2 : palette.black)};

  ${({ disabled }) =>
    !disabled &&
    `
      &:hover {
        background-color: ${palette.brightBlueWithAlpha};
      }
  `}
`;

export const CloseIcon = styled(MaterialCloseIcon)`
  && {
    width: 24px;
    height: 24px;
  }
`;

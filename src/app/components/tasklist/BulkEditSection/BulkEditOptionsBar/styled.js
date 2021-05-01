/* eslint-disable sonarjs/no-identical-functions */
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

export const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

export const WrapperContainer = styled.div`
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

export const AssigneeIcon = styled.div`
  position: relative;
  width: 17px;
  height: 17px;
  border: 1px dashed currentColor;
  border-radius: 9px;

  &:after,
  &:before {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 5px;
    width: 1px;
    transform: translate(0%, -40%);
    content: '';
    background-color: ${palette.brightBlue};
  }

  &:after {
    transform: translate(-40%, 0%);
    width: 5px;
    height: 1px;
  }
`;

export const Button = styled.button`
  height: 100%;
`;

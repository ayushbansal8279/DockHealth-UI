/* eslint-disable sonarjs/no-identical-functions */
import styled from 'styled-components';
import palette from 'styles/palette';

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

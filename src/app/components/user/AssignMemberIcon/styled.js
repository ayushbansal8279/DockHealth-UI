import styled from 'styled-components';
import palette from 'styles/palette';

export const StyledAssignMemberIcon = styled.div`
  position: relative;
  display: inline-block;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border: 0.0625rem dashed ${palette.coolGrey1};
  border-radius: 15px;
  color: ${palette.blueOcean};

  &:after {
    position: absolute;
    content: '+';
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: ${palette.brightBlue};
    margin-top: 0px;
  }

  @media print {
    display: none;
  }
`;

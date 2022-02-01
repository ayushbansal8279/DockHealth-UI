import styled from 'styled-components';
import palette from 'styles/palette';
import { Close } from '@material-ui/icons';

// eslint-disable-next-line import/prefer-default-export
export const AdornmentClear = styled(Close)`
  && {
    width: 20px;
    height: 20px;
    color: ${palette.coolGrey2};
    cursor: ${({ disabled }) => (disabled ? 'initial' : 'pointer')};
  }
`;

export const EndAdornmentContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translate(50%, -50%);
`;

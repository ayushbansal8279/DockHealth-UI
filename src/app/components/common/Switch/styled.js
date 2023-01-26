import { Switch } from '@mui/material';
import styled from 'styled-components';
import palette from 'styles/palette';

export const StyledSwitch = styled(Switch)`
  &&& {
    .MuiSwitch-switchBase {
      color: ${palette.coolGrey4};

      & .checked {
        color: ${palette.darkBlue};
      }

      & .checked + .track {
        background-color: 'rgba(33, 109, 194, 0.38)';
      }
    }
  }
`;

export default StyledSwitch;

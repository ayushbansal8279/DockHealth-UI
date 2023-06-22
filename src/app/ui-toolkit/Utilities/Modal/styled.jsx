import { styled } from '@mui/material/styles';
import Box from 'ui-toolkit/Primitive/Box';

export const Backdrop = styled(Box)`
  overflow: hidden;
  z-index: 999;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.175);
`;
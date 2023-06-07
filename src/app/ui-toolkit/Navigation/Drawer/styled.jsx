import { styled } from '@mui/material/styles';
import Paper from 'ui-toolkit/Element/Paper';

export const Drawer = styled(Paper)`
  overflow-y: scroll;
  position: absolute;
  top: 0;
  right: 0;
  min-width: 375px;
  height: 100%;
  padding: 16px;
`;

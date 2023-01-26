import styled from 'styled-components';
// import { makeStyles } from '@mui/styles';
import palette from 'styles/palette';

export const MenuItemIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 16px;
  width: 16px;
  margin-right: 8px;
  border-radius: 8px;
  background: ${palette.brightBlue};
  color: ${palette.white};
`;

export const useMenuStyles = undefined;
// makeStyles({
//   root: {
//     width: 200,
//   },
// });

import styled from 'styled-components';
import palette from 'styles/palette';
import { MenuList as MuiMenuList } from '@mui/material';

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

export const MenuList = styled(MuiMenuList)`
  &&& {
    .MuiMenuList-root {
      width: 200px;
    }
  }
`;

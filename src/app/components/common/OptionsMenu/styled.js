import styled from 'styled-components';
import { MenuList as MuiMenuList } from '@mui/material';

export const StyledButton = styled.button`
  display: block;
`;

export const MenuList = styled(MuiMenuList)`
  &&& {
    .MuiMenuList-root {
      min-width: 120px;
      max-width: 300px;
    }
  }
`;

export const OptionsMenuContainer = styled.div`
  display: flex;
  @media print {
    display: none;
  }
`;

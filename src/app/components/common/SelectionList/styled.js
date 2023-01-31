import styled from 'styled-components';
import palette from 'styles/palette';
import { MenuItem as MuiMenuItem } from '@mui/material';

export const ListWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  border: 1px solid ${palette.coolGrey2};
  overflow-y: auto;
  overflow-x: hidden;
`;

export const MenuItem = styled(MuiMenuItem)`
  &&& {
    &.MuiMenuItem-root {
      position: relative;
      padding-right: 40px;
    }
  }
`;

export const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 7px;
  transform: translateY(-50%);
  color: ${palette.coolGrey2};
`;

export const EmptyListText = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  transform: translate(-50%, -50%);
  margin-bottom: 0;
  color: ${palette.coolGrey2};
`;

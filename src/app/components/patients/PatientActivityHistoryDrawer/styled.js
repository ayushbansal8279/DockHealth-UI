/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from 'styled-components';
import { fontWeights, fontSizes } from 'styles/font';
import palette from 'styles/palette';
import { TextField, Drawer } from '@mui/material';

export const MoreActinsWrapper = styled.div`
  display: flex;
  width: auto;
`;

export const ContentWrapper = styled.div`
  padding: 0px 10px 48px 10px;
  box-sizing: border-box;
`;

export const TitleName = styled.p`
  margin-bottom: 0;
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.regularPlus};
  font-family: 'Outfit', sans-serif;
  padding: 5px 0 5px 10px;
`;

export const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  padding: 10px 10px;
  display: flex;
  justify-content: space-between;
  z-index: 2;
  background: ${palette.white};
`;

export const DrawerWrapper = styled(Drawer)`
  &.MuiDrawer-docked {
    position: relative;
    z-index: 10;
    flex-shrink: 0;
    white-space: nowrap;
  }

  .MuiDrawer-paper {
    width: 500px;
  }
`;

export const Searchbar = styled(TextField)`
  width: 180px;
  padding: 3px 0 0 0;
  & .MuiOutlinedInput-root {
    padding-right: 8px;
  }

  & .MuiInputAdornment-root {
    cursor: pointer;
  }
`;

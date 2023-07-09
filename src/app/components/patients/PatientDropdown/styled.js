import styled from 'styled-components';
import Skeleton from '@mui/material/Skeleton';
import { Popover } from '@mui/material';
import palette from 'styles/palette';
import spacing from 'styles/spacing';
import { fontSizes, fontWeights } from 'styles/font';

export const StyledPopover = styled(Popover)`
  &&& {
    &.MuiPopover-paper {
      border: none;
      box-shadow: 0px 0px 11px rgba(0, 0, 0, 0.15);
      width: ${({ width }) => width};
    }
    .MuiBackdrop-root {
      opacity: 0 !important;
    }
  }
`;

export const StyledButton = styled.button`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  text-align: left;
`;

export const Input = styled.input`
  border: none;
  width: 100%;
  outline: none;
  margin-left: ${spacing.tiny};
`;

export const InputBox = styled.div`
  display: flex;
  width: 300px;
  padding: ${spacing.smallPlus} ${spacing.smallPlus};
  color: ${palette.mediumGrey};
  font-size: ${fontSizes.smallPlus};
  font-weight: ${fontWeights.light};
  font-family: 'Roboto Condensed', sans-serif;

  &:placeholder {
    color: ${palette.coolGrey2};
  }
`;

export const ListContainer = styled.div`
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  border-top: ${({ withBorder }) =>
    withBorder ? `1px solid ${palette.coolGrey2}` : '0px'};
`;

export const Row = styled.button`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  color: ${palette.coolGrey1};
  font-family: 'Roboto Condensed', sans-serif;
  ${({ isHovered }) => isHovered && `background: ${palette.blueGrey};`}

  &:not(:last-of-type) {
    margin-bottom: ${spacing.tiny};
  }

  &:hover {
    background-color: rgba(193, 204, 218, 0.25);
  }
`;

export const UnassignRow = styled(Row)`
  padding: ${spacing.small};
`;

export const RefineSearchRow = styled(Row)`
  padding: ${spacing.small};
  color: ${palette.oPlusRed};
`;

export const UnassignRowContainer = styled.div`
  border-bottom: ${({ withBorder }) =>
    withBorder ? `1px solid ${palette.coolGrey2}` : '0px'};
`;

export const LoaderItem = styled(Skeleton)`
  &&& {
    &.MuiSkeleton-root {
      margin: ${`${spacing.regular} ${spacing.large}`};
    }
  }
`;

export const LoaderContainer = styled.div`
  padding: ${spacing.smallPlus} 0;
`;

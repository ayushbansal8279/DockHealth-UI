import { makeStyles } from '@mui/styles';
import styled from 'styled-components';
import palette from 'styles/palette';

export const useStyles = makeStyles({
  select: {
    '& .MuiSelect-root': {
      display: 'flex',
      alignItems: 'center',
      height: 46,
      padding: '4px 32px 4px 12px',
      boxSizing: 'border-box',
      borderRadius: 5,
      color: palette.darkGrey,
    },
    '&:hover .MuiSelect-root, &.Mui-focused .MuiSelect-root': {
      background: palette.coolGrey3,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& .switchIcon > path': {
      fill: (props) => props.iconColorActive ?? palette.dirtyBanana,
    },
  },
});

export const SelectWrapper = styled.div`
  @media print {
    display: none;
  }
`;

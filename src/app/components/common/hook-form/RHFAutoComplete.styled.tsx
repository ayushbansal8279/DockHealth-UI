import styled from 'styled-components';
import Autocomplete from '@mui/material/Autocomplete';

export const StyledAutoComplete = styled(Autocomplete)`
  & .MuiAutocomplete-inputRoot {
    &::before {
      border-bottom: none;
    }
    &:hover:not(.Mui-disabled, .Mui-error)::before {
      border-bottom: none;
    }
  }
`;

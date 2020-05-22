import { Chip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { fontSizes } from 'styles/font';
import palette from 'styles/palette';
import { BoldLabel } from 'views/PersonDetails/PersonDetailsView.PersonInfoPanel.Styled';

export const AdornmentContainer = styled.div`
  color: ${palette.orange};
`;

export const DrawerChip = withStyles({
  root: {
    alignSelf: 'flex-end',
    backgroundColor: palette.coolGrey3,
    height: '1.5rem',
    marginTop: 0,
    marginBottom: '0.2rem',
    marginRight: '5px',
    padding: '5px 0px',
  },
  label: {
    color: palette.darkGrey,
    fontWeight: BoldLabel,
  },
})(Chip);

export const DrawerAddChip = withStyles({
  root: {
    alignSelf: 'flex-end',
    backgroundColor: palette.coolGrey3,
    height: '1.5rem',
    width: '46px',
    marginTop: 0,
    marginBottom: '0.2rem',
    marginRight: '10px',
    padding: '5px 0px',
  },
  label: {
    color: palette.orange,
    fontWeight: BoldLabel,
  },
})(Chip);

export const StyledAutoComplete = styled('div')` 
  & .MuiInputBase-root: {
      background-color: ${palette.accentYellow};
  },
`;

export const Listbox = styled('ul')`
  width: 300px;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: ${palette.white};
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }
  }

  & li[data-multiple='true'] > div > div:nth-child(2) {
    visibility: hidden;
  }

  & li[data-multiple='true'] > div > div:nth-child(3) {
    visibility: hidden;
  }

  & li[data-focus='true'] {
    background-color: ${palette.blueGrey};
    cursor: pointer;
  }

  & li[data-focus='true'] > div > div:nth-child(2) {
    visibility: visible;
  }

  & li[data-focus='true'] > div > div:nth-child(3) {
    visibility: visible;
  }

  & li[data-focus='true'][aria-selected='true'] {
    background-color: ${palette.blueGrey};
  }

  & li[aria-selected='true'] {
    background-color: ${palette.white};
  }

  & li[aria-selected='true'] > div > div:first-child {
    color: ${palette.blueOcean};
    font-weight: bold;
  }
`;

export const TagCreateActionButton = styled.div`
  color: ${palette.blueOcean};
  font-size: ${fontSizes.smallPlus};
  min-width: 80px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

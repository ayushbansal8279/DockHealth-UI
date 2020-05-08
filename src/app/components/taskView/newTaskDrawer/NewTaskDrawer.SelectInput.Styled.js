import { Chip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

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
    marginBottom: '0.5rem',
    padding: 0,
  },
  label: {
    color: palette.darkGrey,
    fontWeight: BoldLabel,
  },
})(Chip);

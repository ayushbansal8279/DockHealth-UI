import React from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import GenericHeader from './GenericHeader';

const HeaderLabel = styled.div`
  font-family: 'Montserrat', sans-serif;
  font-size: ${props => (props.small ? 1 : 2.25)}rem;
  line-height: 1.1;
`;

const GenericSublabeledHeader = ({ label, sublabel, isFetching }) => (
  <GenericHeader isFetching={isFetching}>
    <Grid container justify="center" direction="column">
      <HeaderLabel>{label}</HeaderLabel>
      <HeaderLabel small>{sublabel}</HeaderLabel>
    </Grid>
  </GenericHeader>
);

export default GenericSublabeledHeader;

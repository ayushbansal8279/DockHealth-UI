/* eslint-disable import/prefer-default-export */
import React from 'react';
import { Skeleton } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';

export const FilterOptionLoader = withStyles({
  root: {
    height: 30,
    borderRadius: 4,
    '&:not(:last-of-type)': {
      marginBottom: 4,
    },
  },
})(props => <Skeleton variant="rect" {...props} />);

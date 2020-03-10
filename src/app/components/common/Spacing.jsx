import makeStyles from '@material-ui/styles/makeStyles/makeStyles';
import clsx from 'clsx';
import React from 'react';

const spacingMapValues = {
  1: '0.125rem',
  2: '0.25rem',
  3: '0.5rem',
  4: '1rem',
  5: '2rem',
  6: '4rem',
  7: '8rem',
  8: '16rem',
};

const useSpacingClasses = makeStyles({
  horizontal: {
    width: ({ horizontal }) => spacingMapValues[horizontal] ?? 0,
    height: '100%',
  },
  vertical: {
    width: '100%',
    height: ({ vertical }) => spacingMapValues[vertical] ?? 0,
  },
});

const Spacing = React.memo(({ horizontal, vertical }) => {
  const spacingClasses = useSpacingClasses({ horizontal, vertical });

  const className = clsx(
    horizontal && spacingClasses.horizontal,
    vertical && spacingClasses.vertical,
  );

  return <div className={className} />;
});

export default Spacing;

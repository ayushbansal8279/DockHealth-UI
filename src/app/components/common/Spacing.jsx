// import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import prop from 'ramda/src/prop';
import React from 'react';

const spacingMapValues = new Proxy(
  {
    1: '0.125rem',
    2: '0.25rem',
    3: '0.5rem',
    4: '1rem',
    5: '2rem',
    6: '4rem',
    7: '8rem',
    8: '16rem',
  },
  {
    get(mapValues, path) {
      if (path === 'undefined') {
        return '';
      }

      const objectValue = prop(path, mapValues);

      if (!objectValue) {
        throw new Error(
          `Invalid spacing value: ${String(
            path,
          )}, valid values are: ${Object.keys(spacingMapValues).join(', ')}`,
        );
      }

      return objectValue;
    },
  },
);

const useSpacingClasses = undefined;
// makeStyles({
//   root: {
//     display: 'inline-block',
//   },
//   horizontal: {
//     width: ({ horizontal }) => spacingMapValues[horizontal || 1],
//     // height: '100%',
//   },
//   vertical: {
//     width: '100%',
//     height: ({ vertical }) => spacingMapValues[vertical || 1],
//   },
// });

const Spacing = React.memo(({ horizontal, vertical }) => {
  const spacingClasses = useSpacingClasses({ horizontal, vertical });

  const className = clsx(
    spacingClasses.root,
    horizontal && spacingClasses.horizontal,
    vertical && spacingClasses.vertical,
  );

  return <div className={className} />;
});

export default Spacing;

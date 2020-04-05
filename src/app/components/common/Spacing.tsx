import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { prop } from 'ramda';
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

      const objectValue = prop<string>(path, mapValues);

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

interface SpacingProps {
  horizontal?: keyof typeof spacingMapValues;
  vertical?: keyof typeof spacingMapValues;
}

const useSpacingClasses = makeStyles({
  root: {
    display: 'inline-block',
  },
  horizontal: {
    width: ({ horizontal }: SpacingProps) => spacingMapValues[horizontal || 1],
    // height: '100%',
  },
  vertical: {
    width: '100%',
    height: ({ vertical }: SpacingProps) => spacingMapValues[vertical || 1],
  },
});

const Spacing = React.memo(({ horizontal, vertical }: SpacingProps) => {
  const spacingClasses = useSpacingClasses({ horizontal, vertical });

  const className = clsx(
    spacingClasses.root,
    horizontal && spacingClasses.horizontal,
    vertical && spacingClasses.vertical,
  );

  return <div className={className} />;
});

export default Spacing;

import prop from 'ramda/src/prop';
import React from 'react';
import styled, { css } from 'styled-components';

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

const SpacingDiv = styled.div`
  display: inline-block;

  ${({ horizontal }) => css`
    width: ${spacingMapValues[horizontal || 1]};
  `}

  ${({ vertical }) => css`
    width: 100%;
    height: ${spacingMapValues[vertical || 1]};
  `}
`;

const Spacing = React.memo(({ horizontal, vertical }) => {
  return <SpacingDiv horizontal={horizontal} vertical={vertical} />;
});

export default Spacing;

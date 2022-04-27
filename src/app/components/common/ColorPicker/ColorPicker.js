import React from 'react';
import { ORGANIZATION_TILE_COLORS } from 'styles/organization-tile-colors';
import { ColorPickerLabel, Wrapper } from './styled';

export const Variants = {
  STANDARD: 'standard',
  CIRCLE: 'circle',
};

const ColorPicker = ({
  name,
  onChange,
  value,
  variant = Variants.STANDARD,
}) => (
  <Wrapper variant={variant}>
    {ORGANIZATION_TILE_COLORS.map(({ uniqueName, hex }) => (
      <span key={uniqueName}>
        <input
          type="radio"
          name={name}
          id={`${uniqueName}-${name}`}
          value={hex}
          checked={value?.toLowerCase() === hex?.toLowerCase()}
          onChange={event => typeof onChange === 'function' && onChange(event)}
        />
        <ColorPickerLabel
          variant={variant}
          color={hex}
          htmlFor={`${uniqueName}-${name}`}
        />
      </span>
    ))}
  </Wrapper>
);

export default ColorPicker;

import React from 'react';
import { ORGANIZATION_TILE_COLORS } from 'styles/organization-tile-colors';
import { ColorPickerLabel, ColorPickerWrapper } from './styled';

const ColorPicker = ({ name, onChange, value }) => (
  <ColorPickerWrapper>
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
        <ColorPickerLabel color={hex} htmlFor={`${uniqueName}-${name}`} />
      </span>
    ))}
  </ColorPickerWrapper>
);

export default ColorPicker;

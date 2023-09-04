import React from 'react';
import * as Sc from './styled';

export default function Fieldset({ legend, children }) {
  return (
    <Sc.Fieldset>
      {legend && (
        <legend>{legend}</legend>
      )}
      {children}
    </Sc.Fieldset>
  );
}
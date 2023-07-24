import React, { useContext, useEffect } from 'react';
import { Context } from './DataGrid';

/**
 *
 * @param field
 * @param type
 * @param name
 * @param value
 * @param hidden
 * @param unsortable
 * @param editable
 * @returns {null}
 * @constructor
 */
export default function Data({
  field,
  type = 'string',
  name = `You must specify "name" property.`,
  value = null,
  hidden = false,
  unsortable = false,
  editable = false,
}) {
  const { register } = useContext(Context);

  useEffect(() => {
    register({
      field:
        field ??
        name
          .split(' ')
          .join('_')
          .replace(/[^\d:A-Za-z]/, '')
          .toUpperCase(),
      type,
      name,
      hidden,
      unsortable,
      editable,
      value(data) {
        if (value === null) {
          return `You must specify "value" property.`;
        }
        if (typeof value === 'string') {
          return data[value] ?? `No data for "${value}" in dataset.`;
        }
        return value(data);
      },
    });
  }, []);

  return null;
}

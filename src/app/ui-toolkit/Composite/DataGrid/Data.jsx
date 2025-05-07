import { useContext, useEffect } from 'react';
import { Context } from './DataGrid';

/**
 * A component to be only used in conjunction with <DataGrid/> component, to define columns of a dataset.
 * Each instance of a <Data/> component corresponds to a single column.
 *
 * @param field {string}                - is an ID of a column.
 * @param width {number}
 * @param type {'string' | 'number'}    - is a type of data related to this column to be displayed.
 * @param name {string}                 - is a name of a column to display.
 * @param value {string | (() => any)}  - is a value of a cell to display.
 * @param hidden {boolean}              - is a flag whether column should be visible or not.
 * @param editable {boolean}            - is a flag whether column should be editable or not.
 * @param unsortable {boolean}          - is a flag whether column should be sortable or not.
 * @param flex
 * @param headerRenderer {() => JSX.Element} - custom renderer for the column header
 * @returns {null}
 * @constructor
 */
export default function Data({
  field,
  type = 'string',
  name = `You must specify "name" property.`,
  value = null,
  hidden = false,
  editable = false,
  unsortable = false,
  flex = 1,
  headerRenderer = null,
}) {
  const { register, unregister } = useContext(Context);

  useEffect(() => {
    register({
      field:
        field ??
        name
          .toLowerCase()
          .split(' ')
          .join('_')
          .replace(/[^\d:A-Za-z]/, ''),
      type,
      name,
      hidden,
      unsortable,
      editable,
      flex,
      headerRenderer,
      renderCell(cell) {
        if (typeof cell.value === 'string') {
          return cell.value;
        }
        return value(cell.value);
      },
      value(data) {
        if (value === null) {
          return `You must specify "value" property.`;
        }
        if (typeof value === 'string') {
          return data[value] ?? `No data for "${value}" in dataset.`;
        }
        const returnValue = value(data);
        if (typeof returnValue === 'string') {
          return returnValue;
        }
        return data;
      },
    });

    return () => {
      unregister(
        field ??
          name
            .toLowerCase()
            .split(' ')
            .join('_')
            .replace(/[^\d:A-Za-z]/, ''),
      );
    };
  }, [
    register,
    unregister,
    field,
    type,
    name,
    value,
    hidden,
    editable,
    unsortable,
    flex,
  ]);

  return null;
}

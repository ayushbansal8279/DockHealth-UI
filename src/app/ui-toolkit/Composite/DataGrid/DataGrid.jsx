import React, {
  createContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from 'react';
import * as MUI from '@mui/x-data-grid';
import { noop } from 'ui-toolkit/utilities';
import * as Sc from './styled';

export const Context = createContext({
  register: noop,
});

const MemoizedRow = React.memo(MUI.GridRow);

/**
 *
 * @param multiselect
 * @param dataset
 * @param children
 * @param onRecordClick
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function DataGrid({
  multiselect = false,
  dataset = [],
  children,
  onRecordClick = noop,
  ...props
}) {
  const [definitions, setDefinitions] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  const register = useCallback(
    (data) => {
      if (!definitions.some((header) => header.name === data.name)) {
        setDefinitions((currentValue) => [...currentValue, data]);
      }
    },
    [definitions],
  );

  useEffect(() => {
    register({
      field: 'id',
      name: 'Identifier',
      hidden: true,
      value: ({ identifier }) => identifier,
    });
  }, [dataset, register]);

  const columns = useMemo(
    () =>
      definitions.map(({ field, type, name, unsortable, editable }) => ({
        type,
        field,
        headerName: name,
        sortable: !unsortable,
        editable,
        // flex: 1
      })),
    [definitions],
  );

  const rows = useMemo(() => {
    if (definitions.length > 0) {
      return dataset.map((data) =>
        Object.fromEntries(
          definitions.map((definition) => [
            definition.field,
            definition.value(data),
          ]),
        ),
      );
    }
    return [];
  }, [definitions, dataset]);

  useEffect(() => {
    setColumnVisibilityModel(
      Object.fromEntries(
        definitions.map(({ field, hidden }) => [field, !hidden]),
      ),
    );
  }, [definitions]);

  const handleRowClick = (rowInstance, event) => {
    const { row } = rowInstance;
    onRecordClick(event, row);
  };

  return (
    <div
      style={{
        padding: '30px',
        height: '100%',
      }}
    >
      <Sc.DataGrid
        columns={columns}
        rows={rows}
        components={{
          Row: MemoizedRow,
        }}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={setColumnVisibilityModel}
        disableRowSelectionOnClick
        checkboxSelection={multiselect}
        onRowClick={handleRowClick}
        {...props}
      />
      {/* eslint-disable-next-line react/jsx-no-constructed-context-values */}
      <Context.Provider value={{ register }}>{children}</Context.Provider>
    </div>
  );
}

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
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
 * A component for displaying dataset in form of a Grid.
 *
 * @param fluid {boolean}             - is a flag whether columns should expand to their maximum width or not.
 * @param multiselect {boolean}       - is a flag whether row should support multiselect or not.
 * @param dataset {{}[]}              - is a dataset to display.
 * @param onRecordClick {() => void}  - is a callback reacting to clicking on a single record.
 * @param children {JSX.Element}
 * @param props {any}
 * @returns {JSX.Element}
 * @constructor
 */
export default function DataGrid({
  multiselect = false,
  dataset = [],
  onRecordClick = noop,
  children,
  fluid,
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
  }, [register, dataset]);

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

  const columns = useMemo(
    () =>
      definitions.map(
        ({ field, type, name, unsortable, editable, flex, renderCell }) => ({
          type,
          field,
          headerName: name,
          sortable: !unsortable,
          editable,
          renderCell,
          flex: fluid ? flex : undefined,
        }),
      ),
    [definitions, fluid],
  );

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

/*

  const ? = [
    {

    }
  ]


  const dataset = [
    {
        "patientId": 3186,
        "patientIdentifier": "ca640e89-30f3-474b-b96d-015b3d0d448b",
        "firstName": "Wanda",
        "lastName": "Four",
        "phoneHome": "",
        "patientName": "Four, Wanda"
    }
  ]

  <DataGrid
    multiselect
    dataset={}
  >
    <Data
      type="string"
      name="PATIENT"
      enable={{ sticky, sortable, draggable }}
      render={({ firstName, lastName }) =>
        `{firstName} {lastName}`
      }
    />
  </ DataGrid>


 */
